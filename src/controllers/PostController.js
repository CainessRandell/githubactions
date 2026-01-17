const Post = require('../models/Post');

module.exports = {
    // Lista Pública (Alunos e Professores)
    async index(req, res) {
        //console.log("--> Acessou rota GET /posts"); //Log de entrada
        try {
            const posts = await Post.find().sort({ dataCriacao: -1});
            return res.status(200).json(posts);
        } catch (err) {
            console.error("ERRO AO LISTAR POSTS:", err); 
            return res.status(500).json({ error: 'Erro interno ao listar posts'});
        }
    },

    async search(req, res) {
        const { q } = req.query;
        try {
            if (!q) {
                return res.status(400).json({ error: 'Parâmetro de busca não informado'});
            }
            const posts = await Post.find({ $text: { $search: q}});
            return res.status(200).json(posts);
        } catch (err) {
            return res.status(500).json({ error: 'Erro na busca'});
        }
    },

    async show(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }
            return res.status(200).json(post);
        } catch (e) {
             return res.status(400).json({error: 'ID Inválido!'});
        }
    },

    // Apenas Professores (Validado na Rota)
    async store(req, res) {
        try {
            const post = await Post.create(req.body);
            return res.status(201).json(post);
        } catch (err) {
            return res.status(400).json({ error: 'Erro ao criar post' });
        }
    },

    async update(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body, 
            { new: true }
            );
            if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
            }
            return res.status(200).json(post);
        } catch (err) {
            return res.status(400).json({ error: 'Erro ao atualizar' });
        }
    },

    async delete(req, res) {
        try {
           const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }
            return res.status(204).send(); 
        } catch (err) {
            return res.status(400).json({ error: 'Erro ao deletar' });
        }
        
    }
};