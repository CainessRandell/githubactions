const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nome: String,
    email: { 
        type: String, 
        unique: true, 
        required: true,
        lowercase: true,
        match: /.+\@.+\.+/
    },
    senha: { type: String, required: true },
    role: {
        type: String,
        enum: [ 'professor', 'aluno'], //Define papéis permitidos
        default: 'aluno'
    }
});

// criptografar senha antes de salvar
UserSchema.pre('save', async function() {
    if (this.isModified('senha')){
        this.senha = await bcrypt.hash(this.senha, 8);
    }
    
});

module.exports = mongoose.model('User', UserSchema);