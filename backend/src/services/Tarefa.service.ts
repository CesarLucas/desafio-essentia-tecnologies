import { TarefaRepository } from "../repositories/Tarefa.repository";
import { CreateTarefaDto, TarefaResponseDto, UpdateTarefaStatusDto } from "../dtos/Tarefa.dto";

export class TarefaHttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class TarefaService {
  constructor(private repo = new TarefaRepository()) {}

  listAll() {
    return this.repo.findAll();
  }

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
    return { id,
      message: "Foi criado com sucesso uma Tarefa"};
  }

  async updateStatus(userId: number, taskId: number, dto: UpdateTarefaStatusDto) {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new TarefaHttpError(400, "taskId invalido");
    }

    if (!Number.isInteger(dto.status_id) || dto.status_id <= 0) {
      throw new TarefaHttpError(400, "status_id invalido");
    }

    const updated = await this.repo.update(userId, taskId, {
      status_id: dto.status_id,
      finalizado_por: userId,
    });

    if (!updated) {
      throw new TarefaHttpError(404, "Tarefa nao encontrada para este usuario");
    }

    return { message: "Status atualizado com sucesso" };
  }

  update(userId: number, taskId: number, dto: { descricao?: string; status_id?: number; finalizado_por?: number | null; }) {
    return this.repo.update(userId, taskId, dto);
  }

  async remove(userId: number, taskId: number) {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new TarefaHttpError(400, "taskId invalido");
    }

    const removed = await this.repo.delete(userId, taskId);
    if (!removed) {
      throw new TarefaHttpError(404, "Tarefa nao encontrada para este usuario");
    }

    return { message: "Tarefa excluida com sucesso" };
  }
}
