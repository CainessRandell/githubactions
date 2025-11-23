import { Router } from "express";
import { getPosts, getPostById, createPost, updatePost, deletePost, searchPosts } from "../controllers/posts.controller.js"; 
import authMiddleware from "./auth.middleware.js";

const router = Router();
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todas as postagens
 *     description: Retorna uma lista de posts ordenados por data de criação (mais recentes primeiro), incluindo informações do autor.
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: Lista de posts retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   titulo:
 *                     type: string
 *                   conteudo:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   author:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nome:
 *                         type: string
 *                       email:
 *                         type: string
 */
router.get("/", getPosts);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Busca postagens por título ou conteúdo
 *     description: >
 *       Retorna postagens cujo título ou conteúdo contenham o termo informado na query `q`.
 *       A busca é case-insensitive.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Texto para buscar no título ou conteúdo das postagens.
 *     responses:
 *       200:
 *         description: Lista de posts filtrados com base no termo de busca.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   author:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 */
router.get("/search", searchPosts);
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtém uma postagem pelo ID
 *     description: Retorna os dados completos de uma postagem específica, incluindo informações do autor.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da postagem a ser retornada.
 *     responses:
 *       200:
 *         description: Post encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: Post não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/:id", getPostById);
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria uma nova postagem
 *     description: Cria um post com título, conteúdo e ID do autor.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               authorId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro ao criar o post (dados inválidos ou erro de banco).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/", authMiddleware, createPost);
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria uma nova postagem
 *     description: Cria uma postagem com título, conteúdo e ID do autor.
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               authorId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 authorId:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Erro ao criar o post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.put("/:id", authMiddleware, updatePost);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Exclui uma postagem pelo ID
 *     description: Remove permanentemente uma postagem existente no banco de dados.
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da postagem a ser excluída.
 *     responses:
 *       204:
 *         description: Post deletado com sucesso. Nenhum conteúdo é retornado.
 *       404:
 *         description: Post não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Erro ao tentar excluir o post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:*
 */
router.delete("/:id", authMiddleware, deletePost);

export default router;
