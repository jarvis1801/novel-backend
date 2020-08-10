const NovelVersionModel = require('../models/novelVersion')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const moment = require('moment')

// const constants = require("../constants.js")

router.get('/api/novelVersionList', (req, res) => {
    NovelVersionModel.find({}, {}, { sort: { 'createdAt': -1 } }, (err, data) => {
        if (err || data == null) {
            return res.status(500).json({
                version: 0,
                createdAt: "",
                updatedAt: "",
                novelId: []
            })
        }

        return res.status(200).json(data)
    })
})

router.post("/api/novelVersion", (req, res) => {
    const bodyObj = _.clone(req.body)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    if (!_.size(bodyObj.novelIdList) > 0) {
        return res.status(400).send('Enter Novel id list is must')
    }

    bodyObj.createdAt = moment().format()

    const novelVersion = NovelVersionModel(bodyObj)
    novelVersion.save()
        .then(data => {
            if (!data || data.length === 0) {
                return res.status(500).json(data)
            }

            return res.status(200).json(data)
        })
        .catch(err => {
            return res.status(500).json(err)
        })
})

module.exports = router