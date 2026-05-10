const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        const { email, firebaseUid } = req.body;
        try {
            if (!email) {
                return res.status(400).send({ error: 'Email nao informado' });
            }

            if (!firebaseUid) {
                return res.status(400).send({ error: 'firebaseUid nao informado' });
            }

            // Verifica se usuário já existe
            if (await User.findOne({ $or: [{ email }, { firebaseUid }] })) {
                return res.status(400).send({ error: 'Usuário já existe' });
            }

            // Tenta criar o usuário
            const user = await User.create(req.body);

            return res.send({ user });

        } catch (err) {
            // AQUI ESTÁ A CORREÇÃO: Retorna o erro real em vez de travar
            console.error("Erro no Registro:", err); 
            return res.status(400).send({ error: 'Falha no registro', details: err.message });
        }
    },

    async login(req, res) {
        const { firebaseUid } = req.body;
        try {
            if (!firebaseUid) {
                return res.status(400).send({ error: 'firebaseUid nao informado' });
            }

            // Busca usuário vinculado ao Firebase Authentication
            const user = await User.findOne({ firebaseUid });

            if (!user) {
                return res.status(400).send({ error: 'Usuário não encontrado!' });
            }

            // Gera Token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET || 'segredo_escola', {
                expiresIn: 86400,
            });

            res.send({ user, token });

        } catch (err) {
            console.error("Erro no Login:", err);
            return res.status(500).send({ error: 'Erro interno no login' });
        }
    }
};
