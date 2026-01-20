const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ error: 'Token não informado'});

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).send({error: 'Erro no token'});

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) return res.status(401).send({error: 'Token malformatado'});

    jwt.verify(token, process.env.SECRET || 'segredo_escola', (err, decoded) => {
        if (err) return res.status(401).send({error: 'Token inválido' });
        req.userId = decoded.id;
        req.userRole = decoded.role; // Salvamos a role para checar depois
        return next();
    });
};