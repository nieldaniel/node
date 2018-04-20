const postChurch = require('../models/church')

/**
 * Read and Create Church
 */
exports.create = function(req, res){
    const churchs = new postChurch()

    churchs.name = req.body.name
    churchs.address = req.body.address
    churchs.since = req.body.since
    churchs.congregations = req.body.congregations

    churchs.save(function(err){
        if (err) {
            res.send(err)
        }

        res.json({message: 'Church Created!'})
    })
}

exports.list = function(req, res){
    postChurch.find(function(err, church){
        if (err) {
            res.send(err)
        }

        res.json(church)
    })
}

/**
 * Read Detail, Update, Delete Church by Id
 */
exports.show = function(req, res){
    postChurch.findById(req.params.church_id, function(err, church){
        if (err) {
            res.send(err)
        }

        res.json(church)
    })
}

exports.update = function(req, res){
    postChurch.findById(req.params.church_id, function(err, churchs){
        if (err) {
            res.send(err)
        }

        //update church name, address, since, congregations
        churchs.name = req.body.name
        churchs.address = req.body.address
        churchs.since = req.body.since
        churchs.congregations = req.body.congregations

        churchs.save(function(err){
            if(err){
                res.send(err)
            }

            res.json({message: 'Church Updated!'})
        })
    })
}

exports.delete = function(req, res){
    postChurch.remove({
        _id: req.params.church_id
    }, 
    function(err, church){
        if (err) {
            res.send(err)
        }

        res.json({message: 'Church Deleted!'})
    })

}
