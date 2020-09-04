const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MediaSchema = new Schema({
    type: { type: String, required: true },
    content: { type: String, default: null },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
})

// Export the model
module.exports = mongoose.model('Media', MediaSchema)