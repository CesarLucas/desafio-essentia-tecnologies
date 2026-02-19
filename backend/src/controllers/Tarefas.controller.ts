import { Response } from "express";
import { TarefaService } from "../services/Tarefa.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class TarefasController {
  constructor(private service = new TarefaService()) {}

  list = async (req: AuthRequest, res: Response) => {
    const tasks = await this.service.list(req.userId!);
    res.json(tasks);
  };

  create = async (req: AuthRequest, res: Response) => {
    const { descricao, status_id } = req.body;

    const result = await this.service.create(
      req.userId!,
      descricao,
      status_id
    );

    res.status(201).json(result);
  };
}
