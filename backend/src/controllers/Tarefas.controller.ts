import { Response } from "express";
import { TarefaService, TarefaHttpError } from "../services/Tarefa.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateTarefaDto, UpdateTarefaStatusDto } from "../dtos/Tarefa.dto";

export class TarefasController {
  constructor(private service = new TarefaService()) {}

  list = async (req: AuthRequest, res: Response) => {
    try {
      const tasks = await this.service.list(req.userId!);
      res.json(tasks);
    } catch {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  listAll = async (_req: AuthRequest, res: Response) => {
    try {
      const tasks = await this.service.listAll();
      res.json(tasks);
    } catch {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  create = async (req: AuthRequest, res: Response) => {
    try {
      const dto = req.body as CreateTarefaDto;
      const result = await this.service.create(req.userId!, dto);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof TarefaHttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  updateStatus = async (req: AuthRequest, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const dto = req.body as UpdateTarefaStatusDto;
      const result = await this.service.updateStatus(req.userId!, taskId, dto);
      res.json(result);
    } catch (error) {
      if (error instanceof TarefaHttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  remove = async (req: AuthRequest, res: Response) => {
    try {
      const taskId = Number(req.params.id);
      const result = await this.service.remove(req.userId!, taskId);
      res.json(result);
    } catch (error) {
      if (error instanceof TarefaHttpError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };
}
