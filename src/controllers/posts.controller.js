import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({ include: { author: true }, orderBy: { createdAt: "desc" } });
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({ where: { id }, include: { author: true } });
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
};

export const createPost = async (req, res) => {
  const { title, content, authorId } = req.body;
  try {
    const post = await prisma.post.create({ data: { title, content, authorId } });
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await prisma.post.update({ where: { id }, data: { title, content } });
    res.json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  await prisma.post.delete({ where: { id } });
  res.status(204).send();
};

export const searchPosts = async (req, res) => {
  const q = req.query.q || "";
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } }
      ]
    },
    include: { author: true }
  });
  res.json(posts);
};
