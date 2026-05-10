const User = require('../models/User');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const normalizeQueryParam = (value) => {
    if (Array.isArray(value)) return value[0];
    return value;
};

module.exports = {
    async index(req, res) {
        const nome = normalizeQueryParam(req.query.nome);
        const email = normalizeQueryParam(req.query.email);
        const role = normalizeQueryParam(req.query.role);

        try {
            const filters = {};

            if (nome) {
                filters.nome = { $regex: escapeRegExp(nome), $options: 'i' };
            }

            if (email) {
                filters.email = { $regex: escapeRegExp(email.toLowerCase()), $options: 'i' };
            }

            if (role) {
                const normalizedRole = role.toLowerCase();
                if (!['professor', 'aluno'].includes(normalizedRole)) {
                    return res.status(400).json({ error: 'Role invalida' });
                }
                filters.role = normalizedRole;
            }

            const users = await User.find(filters)
                .sort({ nome: 1, email: 1 });

            return res.status(200).json(users);
        } catch (err) {
            console.error('ERRO AO LISTAR USUARIOS:', err);
            return res.status(500).json({ error: 'Erro interno ao listar usuarios' });
        }
    },

    async show(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario nao encontrado' });
            }

            return res.status(200).json(user);
        } catch (err) {
            if (err.name === 'CastError') {
                return res.status(400).json({ error: 'ID invalido' });
            }

            console.error('ERRO AO BUSCAR USUARIO:', err);
            return res.status(500).json({ error: 'Erro interno ao buscar usuario' });
        }
    },

    async update(req, res) {
        const { nome, email, firebaseUid, role } = req.body;

        try {
            if (role && !['professor', 'aluno'].includes(role.toLowerCase())) {
                return res.status(400).json({ error: 'Role invalida' });
            }

            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario nao encontrado' });
            }

            if (nome !== undefined) user.nome = nome;
            if (email !== undefined) user.email = email;
            if (firebaseUid !== undefined) user.firebaseUid = firebaseUid;
            if (role !== undefined) user.role = role.toLowerCase();

            await user.save();

            return res.status(200).json(user);
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Email ja cadastrado' });
            }

            if (err.name === 'CastError') {
                return res.status(400).json({ error: 'ID invalido' });
            }

            console.error('ERRO AO ATUALIZAR USUARIO:', err);
            return res.status(400).json({ error: 'Erro ao atualizar usuario' });
        }
    },

    async delete(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario nao encontrado' });
            }

            return res.status(204).send();
        } catch (err) {
            if (err.name === 'CastError') {
                return res.status(400).json({ error: 'ID invalido' });
            }

            console.error('ERRO AO DELETAR USUARIO:', err);
            return res.status(400).json({ error: 'Erro ao deletar usuario' });
        }
    }
};
