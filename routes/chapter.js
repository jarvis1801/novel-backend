const VolumeModel = require('../models/volume')
const ChapterModel = require('../models/chapter')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const moment = require('moment')


router.post('/api/chapter', (req, res) => {
    const isString = _.isString(req.body)
    const bodyObj = isString ? JSON.parse(req.body) : _.clone(req.body)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    if (bodyObj['index'] == null || bodyObj['index'] == undefined) {
        VolumeModel.findOne({
            _id: bodyObj.volumeId
        }).populate('chapterList').exec().then((volume) => {
            console.log(volume)
            var chapterList = volume.chapterList
            if (_.size(chapterList) > 0) {
                bodyObj['index'] = _.maxBy(volume.chapterList, 'index').index + 1
            } else {
                _.set(bodyObj, 'index', 0)
            }
            createChapter(bodyObj, res)
        }).catch(err => {
            console.log(err)
            return res.status(500).json(err)
        })
    } else {
        createChapter(bodyObj, res)
    }
})

var createChapter = (bodyObj, res) => {
    if (!_.size(bodyObj.paragraph) > 0) {
        const paragraphArray = []
        var contentStr = _.clone(bodyObj.contentToParagraph)
        contentStr = _.replace(contentStr, /\,/g, '，')
        contentStr = _.replace(contentStr, /\./g, '。')
        contentStr = _.replace(contentStr, /\n\n/g, '\n')

        const contentArray = _.split(contentStr, '\n')

        _.forEach(contentArray, (value) => {
            paragraphArray.push({
                data: value
            })
        })
        bodyObj.paragraph = paragraphArray
    }

    bodyObj.createdAt = moment().format()
    bodyObj.updatedAt = moment().format()

    const chapter = new ChapterModel(bodyObj)
    chapter.save()
        .then(data => {
            if (!data || data.length === 0) {
                return res.status(500).json(data)
            }

            VolumeModel.findOne({
                    _id: bodyObj.volumeId
                }).then(data2 => {
                    if (!data2 || data2.length === 0) {
                        chapter.deleteOne({ _id: data._id })
                        return res.status(500).json(err2)
                    }

                    data2.chapterList.push(data._id)
                    data2.save()

                    return res.status(201).json(data)

                })
                .catch(err2 => {
                    chapter.deleteOne({ _id: data._id })
                    return res.status(500).json(err2)
                })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json(err)
        })
}

router.post("/api/chapter/lastIndex", (req, res) => {
    const bodyObj = _.clone(req.body)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    VolumeModel.findOne({
        _id: bodyObj.volumeId
    }).populate('chapterList').exec().then((volume) => {
        return res.status(200).json(_.maxBy(volume.chapterList, 'index').index + 1)
    }).catch(err => {
        console.log(err)
        return res.status(500).json(err)
    })
})

router.delete('/api/chapter/:id', (req, res) => {
    ChapterModel.deleteOne({
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

router.put('/api/chapter/updateIndex', (req, res) => {
    const bodyObj = _.clone(req.body)

    if (!bodyObj) {
        return res.status(400).send('Request body is missing')
    }

    var isError = false

    _.forEach(bodyObj, (val, key) => {
        ChapterModel.findOneAndUpdate({
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