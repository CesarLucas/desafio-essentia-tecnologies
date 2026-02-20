import { TarefaRepository } from "../repositories/Tarefa.repository";
import { CreateTarefaDto, TarefaResponseDto } from "../dtos/Tarefa.dto";

export class TarefaHttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class TarefaService {
  constructor(private repo = new TarefaRepository()) {}

  list(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async create(userId: number, dto: CreateTarefaDto): Promise<TarefaResponseDto> {
    const descricao = dto.descricao?.trim();
    if (!descricao) {
      throw new TarefaHttpError(400, "Descrição é obrigatoria");
    }

    if (!Number.isInteger(dto.status_id) || dto.status_id <= 0) {
      throw new TarefaHttpError(400, "status_id invalido");
    }

    const id = await this.repo.create(userId, descricao, dto.status_id);
    return { id };
  }

  update(userId: number, taskId: number, dto: { descricao?: string; status_id?: number; finalizado_por?: number | null; }) {
    return this.repo.update(userId, taskId, dto);
  }

  remove(userId: number, taskId: number) {
    return this.repo.delete(userId, taskId);
  }
}
