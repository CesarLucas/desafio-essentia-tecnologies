import "./config/load-env";
import express, { Request, Response } from "express";
import authRoutes from "./routes/Auth.routes";
import tarefasRoutes from "./routes/Tarefas.routes";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/tarefas", tarefasRoutes);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
