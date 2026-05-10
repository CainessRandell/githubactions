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
                .select('-senha')
                .sort({ nome: 1, email: 1 });

            return res.status(200).json(users);
        } catch (err) {
            console.error('ERRO AO LISTAR USUARIOS:', err);
            return res.status(500).json({ error: 'Erro interno ao listar usuarios' });
        }
    }
};
