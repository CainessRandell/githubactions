const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        const { email } = req.body;
        try {
            // Verifica se usuário já existe
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'Usuário já existe' });
            }

            // Tenta criar o usuário
            const user = await User.create(req.body);

            // Limpa a senha para não retornar no JSON
            user.senha = undefined;

            return res.send({ user });

        } catch (err) {
            // AQUI ESTÁ A CORREÇÃO: Retorna o erro real em vez de travar
            console.error("Erro no Registro:", err); 
            return res.status(400).send({ error: 'Falha no registro', details: err.message });
        }
    },

    async login(req, res) {
        const { email, senha } = req.body;
        try {
            // Busca usuário e senha (precisamos do campo senha que vem criptografado)
            const user = await User.findOne({ email }).select('+senha');

            if (!user) {
                return res.status(400).send({ error: 'Usuário não encontrado!' });
            }

            // Compara a senha enviada com a do banco
            if (!await bcrypt.compare(senha, user.senha)) {
                return res.status(400).send({ error: 'Senha inválida' });
            }

            // Gera Token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET || 'segredo_escola', {
                expiresIn: 86400,
            });

            // Remove senha do retorno
            user.senha = undefined;

            res.send({ user, token });

        } catch (err) {
            console.error("Erro no Login:", err);
            return res.status(500).send({ error: 'Erro interno no login' });
        }
    }
};