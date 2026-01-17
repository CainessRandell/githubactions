const express = require('express');
const routes = express.Router();
const AuthController = require('./controllers/AuthController');
const PostController = require('./controllers/PostController');

//Middlewares
const authMiddleware = require('./middlewares/auth');
const checkRole = require('./middlewares/permission');
const isProfessor = checkRole('professor');

//Rotas Públicas
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

// --- Daqui para baixo, precisa estar logado (Aluno ou Professor) ---
routes.use(authMiddleware);

// Leitura (Aluno e Professor)
routes.get('/posts', PostController.index);
routes.get('/posts/search', PostController.search);
routes.get('/posts/:id', PostController.show);

// Escrita/Gestão (Apenas Professor)
routes.post('/posts', isProfessor, PostController.store);
routes.put('/posts/:id', isProfessor, PostController.update);
routes.delete('/posts/:id', isProfessor, PostController.delete);

module.exports = routes;