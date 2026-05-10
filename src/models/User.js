const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome: String,
    firebaseUid: {
        type: String,
        unique: true,
        required: true
    },
    email: { 
        type: String, 
        unique: true, 
        required: true,
        lowercase: true,
        match: /.+\@.+\.+/
    },
    role: {
        type: String,
        enum: [ 'professor', 'aluno'], //Define papéis permitidos
        default: 'aluno'
    }
});

module.exports = mongoose.model('User', UserSchema);
