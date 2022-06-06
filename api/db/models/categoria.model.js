
const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    //Com auth
    _userId:{
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Categoria = mongoose.model('Categoria', CategoriaSchema);

module.exports = { Categoria }