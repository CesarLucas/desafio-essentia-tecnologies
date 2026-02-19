import "./config/load-env";
import express, { Request, Response } from "express";
import authRoutes from "./routes/Auth.routes";
import tarefasRoutes from "./routes/Tarefas.routes";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/tarefas", tarefasRoutes);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
