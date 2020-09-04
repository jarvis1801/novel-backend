const MediaModel = require('../models/media')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const moment = require('moment')

router.post('/api/media', upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    const bodyObj = _.clone(req.body)
    const files = _.clone(req.files)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    bodyObj.createdAt = moment().format()
    bodyObj.updatedAt = moment().format()

    if (_.size(files['image']) > 0) {
        if (!_.isNull(files['image'][0])) {
            const imageBase64 = base64ToString(bufferToBase64(files['thumbnailMain'][0].buffer))
            if (_.size(imageBase64) > 0) {
                _.set(bodyObj, 'image', imageBase64)
            }
        }
    }

    const media = new MediaModel(bodyObj)
    media.save()
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