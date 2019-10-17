const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true,
        trim: true
    },
    competed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Object id yang disimpan akan mengacu ke collection 'User'
    }
}, {
    timestamps: true // Mencatat waktu saat di buat dan terakhir update
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task