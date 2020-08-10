const mongoose = require('mongoose')

const ChapterSchema = mongoose.Schema({
    sectionName: { type: String, required: true },
    title: { type: String, default: null },
    paragraph: [{
        data: { type: String, default: "" },
        type: { type: String, default: "content" },
        _id: false
    }],
    index: { type: Number, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    volumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volume', required: true }
})

module.exports = mongoose.model('Chapter', ChapterSchema)