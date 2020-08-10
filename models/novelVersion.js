const mongoose = require('mongoose')

const NovelVersionSchema = mongoose.Schema({
    version: { type: Number, required: true },
    createdAt: { type: String, required: true },
    novelIdList: [{
        data: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Novel',
            required: true
        },
        type: {
            type: String,
            required: true
        },
        _id: false
    }]
})

module.exports = mongoose.model('NovelVersion', NovelVersionSchema)