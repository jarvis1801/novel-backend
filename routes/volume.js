const VolumeModel = require('../models/volume')
const ChapterModel = require('../models/chapter')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const moment = require('moment')


router.get('/api/volumeList/:id', (req, res) => {
    VolumeModel.find({
        novelId: req.params.id
    }).populate('chapterList').exec().then((data) => {
        return res.status(200).json(data)
    })
})

router.post('/api/volume', (req, res) => {
    const bodyObj = _.clone(req.body)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    bodyObj.createdAt = moment().format()
    bodyObj.updatedAt = moment().format()

    const volume = new VolumeModel(bodyObj)
    volume.save()
        .then(data => {
            if (!data || data.length === 0) {
                return res.status(500).json(data)
            }

            return res.status(201).json(data)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json(err)
        })
})

router.delete('/api/volume/:id', (req, res) => {
    VolumeModel.deleteOne({
        _id: req.params.id
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false
            })
        }

        return res.status(200).json({
            success: true
        })
    })
})

router.put('/api/volume/updateIndex', (req, res) => {
    const bodyObj = _.clone(req.body)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    var isError = false

    _.forEach(bodyObj, (val, key) => {
        VolumeModel.findOneAndUpdate({
            _id: val.id
        }, { $set: { index: val.index } }, { upsert: true }, (err, data) => {
            if (err) {
                isError = true
            }
        })
    })

    if (isError) {
        return res.status(500).json({
            success: false
        })
    }

    return res.status(200).json({
        success: true
    })
})


module.exports = router