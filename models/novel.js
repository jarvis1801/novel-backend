const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NovelSchema = new Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    thumbnailMain: { type: String, required: false, default: null },
    thumbnailSection: { type: String, required: false, default: null },
    star: { type: Number, required: false, },
    isEnd: { type: Boolean, required: false, default: false },
    endDate: { type: String, required: false },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
})

// Export the model
module.exports = mongoose.model('Novel', NovelSchema)