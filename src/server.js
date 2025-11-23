import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import postsRouter from "./routes/posts.routes.js";
import authRouter from "./routes/auth.routes.js";
import { swaggerUi, swaggerDocs } from "./swagger.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Swagger com host dinâmico
app.use(
  "/api-docs",
  (req, res, next) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.get("host");

    swaggerDocs.servers = [
      {
        url: `${protocol}://${host}`,
      },
    ];

    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs)
);

app.get("/", (req, res) => res.send("API FIVAM está rodando 🚀"));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
