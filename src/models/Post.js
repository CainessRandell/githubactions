const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    autor: String,
    dataCriacao: {
        type: Date,
        default: Date.now
    }
});

// Cria um índice de texto para permitir a busca (Requisito: GET /posts/search)
PostSchema.index({
    titulo: 'text',
    conteudo: 'text'
});

module.exports = mongoose.model('Post', PostSchema);