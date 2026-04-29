import { TarefaRepository } from "../repositories/Tarefa.repository";
import { CreateTarefaDto, TarefaResponseDto, UpdateTarefaDescricaoDto, UpdateTarefaStatusDto } from "../dtos/Tarefa.dto";

export class TarefaHttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

function isValidDateOnly(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
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
      throw new TarefaHttpError(400, "Descricao e obrigatoria");
    }

    const vencimento = dto.vencimento_em?.trim();
    if (!vencimento || !isValidDateOnly(vencimento)) {
      throw new TarefaHttpError(400, "Formato invalido. Use o formato YYYY-MM-DD");
    }

    if (vencimento) {
    const dataVencimento = new Date(vencimento + 'T00:00:00'); 
    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);
    dataVencimento.setHours(0, 0, 0, 0);

    if (dataVencimento < hoje) {
      throw new TarefaHttpError(400, "Prazos retroativos não são permitidos. Escolha hoje ou uma data futura.");
    }
  }

    if (!Number.isInteger(dto.status_id) || dto.status_id <= 0) {
      throw new TarefaHttpError(400, "status_id invalido");
    }

    const id = await this.repo.create(userId, descricao, vencimento, dto.status_id);
    return { id, message: "Foi criado com sucesso uma Tarefa" };
  }

  async updateStatus(userId: number, taskId: number, dto: UpdateTarefaStatusDto) {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new TarefaHttpError(400, "taskId invalido");
    }

    if (!Number.isInteger(dto.status_id) || dto.status_id <= 0) {
      throw new TarefaHttpError(400, "status_id invalido");
    }

    const updated = await this.repo.updateStatusAnyUser(taskId, dto.status_id, userId);

    if (!updated) {
      throw new TarefaHttpError(404, "Tarefa nao encontrada");
    }

    return { message: "Status atualizado com sucesso" };
  }

  async updateDescription(userId: number, taskId: number, dto: UpdateTarefaDescricaoDto) {
    if (!Number.isInteger(taskId) || taskId <= 0) {
      throw new TarefaHttpError(400, "taskId invalido");
    }

    const descricao = dto.descricao?.trim();
    if (!descricao) {
      throw new TarefaHttpError(400, "Descricao e obrigatoria");
    }

    const updated = await this.repo.update(userId, taskId, { descricao });
    if (!updated) {
      throw new TarefaHttpError(404, "Tarefa nao encontrada para este usuario");
    }

    return { message: "Descricao atualizada com sucesso" };
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
