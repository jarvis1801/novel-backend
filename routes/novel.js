const NovelModel = require('../models/novel')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const moment = require('moment')
const multer = require("multer")
const upload = multer({
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                cb(new Error('Please upload an image'))
            }
            cb(null, true)
        }
    })
    // const constants = require("../constants.js")

router.get('/api/novelList', (req, res) => {
    NovelModel.find({}, (err, data) => {
        if (err) {
            return res.status(500).json([])
        }

        return res.status(200).json(data)
    })
})

router.get('/api/novel/:id', (req, res) => {
    NovelModel.findOne({
        _id: req.params.id
    }, (err, data) => {
        if (err) {
            return res.status(500).json([])
        }

        return res.status(200).json(data)
    })
})

router.post('/api/novel', upload.fields([{ name: 'thumbnailMain', maxCount: 1 }, { name: 'thumbnailSection', maxCount: 1 }]), (req, res) => {
    const bodyObj = _.clone(req.body)
    const files = _.clone(req.files)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    bodyObj.createdAt = moment().format()
    bodyObj.updatedAt = moment().format()

    if (_.size(files['thumbnailMain']) > 0) {
        if (!_.isNull(files['thumbnailMain'][0])) {
            _.set(bodyObj, 'thumbnailMainBlob', files['thumbnailMain'][0].buffer.toJSON().data)
        }
    }

    if (_.size(files['thumbnailSection']) > 0) {
        if (!_.isNull(files['thumbnailSection'][0])) {
            _.set(bodyObj, 'thumbnailSectionBlob', files['thumbnailSection'][0].buffer.toJSON().data)
        }
    }

    const novel = new NovelModel(bodyObj)
    novel.save()
        .then(data => {
            if (!data || data.length === 0) {
                return res.status(500).json(data)
            }

            res.status(201).json(data)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.put('/api/novel/:id', (req, res) => {

    const bodyData = {}
    bodyData['name'] = req.body.name
    bodyData['author'] = req.body.author
    bodyData['updatedAt'] = moment().format()

    NovelModel.findOneAndUpdate({
        _id: req.params.id
    }, { $set: bodyData }, { upsert: true, returnOriginal: false, new: true }, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false
            })
        }

        return res.status(200).json(data)
    })
})

router.delete('/api/novel/:id', (req, res) => {
    NovelModel.deleteOne({
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

router.put('/api/novel/migrate/1', (req, res) => {
    NovelModel.findOne({
        _id: "5f53152cf3688c20880e17c5"
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false
            })
        }

        const saveObj = {}
        saveObj['thumbnailMainBlob'] = data.thumbnailMainBlob
        saveObj['thumbnailSectionBlob'] = data.thumbnailSectionBlob

        NovelModel.findOneAndUpdate({
            _id: "5f01875d0f5d6c2e2426f2f6"
        }, { $set: saveObj }, { upsert: true, returnOriginal: false, new: true }, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false
                })
            }

            return res.status(200).json(data)
        })
    })
})

const bufferToBase64 = (string) => {
    return Buffer.from(string.toString("base64"))
}

const base64ToString = (base64Str) => {
    return base64Str.toString('utf8')
}

module.exports = router