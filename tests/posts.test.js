import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

jest.mock("@prisma/client");
import { mockPrisma } from "@prisma/client";
import postsRouter from "../src/routes/posts.routes.js";

const app = express();
app.use(express.json());
app.use("/posts", postsRouter);

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret";
});

beforeEach(() => {
  Object.values(mockPrisma.post).forEach((fn) => fn.mockReset());
  Object.values(mockPrisma.user).forEach((fn) => fn.mockReset());
});

const authHeader = () => {
  const token = jwt.sign({ sub: "user-1", role: "ALUNO" }, process.env.JWT_SECRET);
  return { Authorization: `Bearer ${token}` };
};

describe("Posts routes", () => {
  test("GET /posts returns list of posts", async () => {
    mockPrisma.post.findMany.mockResolvedValue([
      { id: "1", title: "Hello", content: "World", authorId: "user-1" }
    ]);

    const res = await request(app).get("/posts");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: "1", title: "Hello", content: "World", authorId: "user-1" }
    ]);
  });

  test("POST /posts creates a post when authorized", async () => {
    const newPost = { id: "2", title: "New", content: "Post", authorId: "user-1" };
    mockPrisma.post.create.mockResolvedValue(newPost);

    const res = await request(app)
      .post("/posts")
      .set(authHeader())
      .send({ title: "New", content: "Post", authorId: "user-1" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newPost);
  });

  test("PUT /posts/:id updates a post when authorized", async () => {
    const updated = { id: "3", title: "Updated", content: "Content", authorId: "user-1" };
    mockPrisma.post.update.mockResolvedValue(updated);

    const res = await request(app)
      .put("/posts/3")
      .set(authHeader())
      .send({ title: "Updated", content: "Content" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
  });

  test("DELETE /posts/:id removes a post when authorized", async () => {
    mockPrisma.post.delete.mockResolvedValue({});

    const res = await request(app).delete("/posts/4").set(authHeader());

    expect(res.status).toBe(204);
    expect(mockPrisma.post.delete).toHaveBeenCalledWith({ where: { id: "4" } });
  });
});
