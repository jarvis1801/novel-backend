const mongoose = require('mongoose')

const VolumeSchema = mongoose.Schema({
    sectionName: { type: String, required: true },
    index: { type: Number, required: false, default: null },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
    novelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Novel', required: true },
    chapterList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', default: [] }],
    isStickyHeader: { type: Boolean, default: false }
})

module.exports = mongoose.model('Volume', VolumeSchema)