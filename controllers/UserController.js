const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const express = require('express')

const { validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const User = require('../models/user')
const config = require('../config')
const errorFormatter = require('../helpers/errorFormater')

const router = express.Router()

exports.register = function(req, res){
    const errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() })
    }

    const data = matchedData(req)

    const hashedPassword = bcrypt.hashSync(data.password, 8)

    //There should not be the same email
    User.find({ email: data.email }, function(err, user){
        if (user.email) {
            return res.json({ message: 'Email has been registered.'})
        }

        User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            originChurch: req.body.originChurch,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone
        }, function(err, user){
            if (err) {
                return res.status(500).send("There was a problem registering the user.")
            }
    
            const token = jwt.sign({ id: user._id }, config.secret, { expiresIn:86400 })
    
            res.status(200).send({ auth: true, message: 'Successfully registered. Please first login by your email and password to get the token.'/*token: token*/ })
        })
    })
}

exports.me = function(req, res, next){
    const token = req.headers['x-access-token']

    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.'})
    }

    jwt.verify(token, config.secret, function(err, decoded){
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.'})
        }

        //res.status(200).send(decoded)

        
        /* User.findById(decoded.id, function(err, user){
            if (err) {
                return res.status(500).send("There was a problem finding the user.")
            }
    
            if (!user) {
                return res.status(404).send("No user found.")
            }
        
            res.status(200).send(user)
        }) */
       

        //Hide password
        User.findById(decoded.id, { password: 0 }, function(err, user){
            if (err) {
                return res.status(500).send('There was a problem finding the user.')
            }
    
            if (!user) {
                return res.status(404).send('No user found.')
            }
        
            res.status(200).send(user)
            //next(user)
        })
    })
}

// --(2)
router.use(function(user, req, res, next){
    res.status(200).send(user)
})

exports.login = function(req, res){
    User.findOne({ email: req.body.email }, function(err, user){
        if (err) {
            return res.status(500).send('Error on the server.')
        }

        if (!user) {
            return res.status(404).send('No user found.')
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null })
        }

        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 })

        res.status(200).send({ auth:true, token: token })
    })
}

exports.logout = function(req, res){
    res.status(200).send({ auth: false, token: null })
}

