const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/blogging_escola';

        await mongoose.connect(uri);

        console.log(`MongoDB Conectado com sucesso!`)
    } catch (err) {
        console.error('Erro fatal ao conectar no MongoDB:', err);
        process.exit(1); // Encerra a aplicação se o banco não conectar
    }
};

module.exports = connectDB;