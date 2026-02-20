import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface Tarefa {
  id: number;
  descricao: string;
  criado_por: number;
  criado_por_nome?: string;
  status_id: number;
  created_at: string;
  updated_at: string;
  finalizado_em: string | null;
  finalizado_por: number | null;
}

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private readonly baseUrl = 'http://localhost:3000';
  private allCache: Tarefa[] | null = null;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Tarefa[]>(`${this.baseUrl}/tarefas`);
  }

  listAll(force = false): Observable<Tarefa[]> {
    if (!force && this.allCache) {
      return of([...this.allCache]);
    }

    return this.http.get<Tarefa[]>(`${this.baseUrl}/tarefas/todas`).pipe(
      tap((tarefas) => {
        this.allCache = [...tarefas];
      })
    );
  }

  create(descricao: string, status_id: number) {
    return this.http.post<{ id: number }>(`${this.baseUrl}/tarefas`, { descricao, status_id });
  }

  updateStatus(id: number, status_id: number) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/tarefas/${id}/status`, { status_id });
  }

  updateDescription(id: number, descricao: string) {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/tarefas/${id}/descricao`, { descricao });
  }

  remove(id: number) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/tarefas/${id}`);
  }

  setAllCache(tarefas: Tarefa[]): void {
    this.allCache = [...tarefas];
  }

  updateTaskInAllCache(taskId: number, patch: Partial<Tarefa>): void {
    if (!this.allCache) return;
    this.allCache = this.allCache.map((tarefa) =>
      tarefa.id === taskId ? { ...tarefa, ...patch } : tarefa
    );
  }

  removeTaskFromAllCache(taskId: number): void {
    if (!this.allCache) return;
    this.allCache = this.allCache.filter((tarefa) => tarefa.id !== taskId);
  }

  prependTaskToAllCache(tarefa: Tarefa): void {
    if (!this.allCache) {
      this.allCache = [tarefa];
      return;
    }

    this.allCache = [tarefa, ...this.allCache];
  }

  replaceTaskInAllCache(tempId: number, tarefaReal: Tarefa): void {
    if (!this.allCache) {
      this.allCache = [tarefaReal];
      return;
    }

    this.allCache = this.allCache.map((tarefa) => (tarefa.id === tempId ? tarefaReal : tarefa));
  }

  getAllCacheSnapshot(): Tarefa[] {
    return this.allCache ? [...this.allCache] : [];
  }
}
