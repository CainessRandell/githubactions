const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createFirebaseUser, deleteFirebaseUser } = require('../services/firebaseAdmin');

module.exports = {
    async register(req, res) {
        const { nome, email, password, role } = req.body;
        try {
            if (!email) {
                return res.status(400).send({ error: 'Email nao informado' });
            }

            if (!password) {
                return res.status(400).send({ error: 'Password nao informado' });
            }

            // Verifica se usuário já existe
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'Usuário já existe' });
            }

            const firebaseUser = await createFirebaseUser({
                email,
                password,
                displayName: nome
            });

            let user;
            try {
                user = await User.create({
                    nome,
                    email,
                    role,
                    firebaseUid: firebaseUser.uid
                });
            } catch (mongoError) {
                await deleteFirebaseUser(firebaseUser.uid).catch((deleteError) => {
                    console.error('Erro ao desfazer usuario no Firebase:', deleteError);
                });
                throw mongoError;
            }

            return res.send({ user });

        } catch (err) {
            // AQUI ESTÁ A CORREÇÃO: Retorna o erro real em vez de travar
            console.error("Erro no Registro:", err); 
            if (err.code === 'auth/email-already-exists') {
                return res.status(400).send({ error: 'Usuário já existe no Firebase Authentication' });
            }
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
