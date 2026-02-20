import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Tarefa {
  id: number;
  descricao: string;
  criado_por: number;
  status_id: number;
  created_at: string;
  updated_at: string;
  finalizado_em: string | null;
  finalizado_por: number | null;
}

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Tarefa[]>(`${this.baseUrl}/tarefas`);
  }

  create(descricao: string, status_id: number) {
    return this.http.post<{ id: number }>(`${this.baseUrl}/tarefas`, { descricao, status_id });
  }
}
