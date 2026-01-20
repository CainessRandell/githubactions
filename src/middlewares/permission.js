module.exports = (requiredRole) => {
    return (req, res, next) => {
        // Se a role do usuário não for a necessária (ex: 'professor)
        if (req.userRole !== requiredRole){
            return res.status(403).json({ error: 'Acesso negado: Requer permissão de professor.'});
        }
        next();
    };
};