
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _categoriaId:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    completada:{
        type: Boolean,
        default: false
    },
    data: {
        type: Date,
        required: false
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task }