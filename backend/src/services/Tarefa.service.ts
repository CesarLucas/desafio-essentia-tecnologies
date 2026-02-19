import { TarefaRepository } from "../repositories/Tarefa.repository";

export class TarefaService {
  constructor(private repo = new TarefaRepository()) {}

  list(userId: number) {
    return this.repo.findAllByUser(userId);
  }

  async create(userId: number, descricao: string, status_id: number) {
    const id = await this.repo.create(userId, descricao, status_id);
    // opcional: buscar e retornar a task criada
    return { id };
  }

  update(userId: number, taskId: number, dto: { descricao?: string; status_id?: number; finalizado_por?: number | null; }) {
    return this.repo.update(userId, taskId, dto);
  }

  remove(userId: number, taskId: number) {
    return this.repo.delete(userId, taskId);
  }
}
