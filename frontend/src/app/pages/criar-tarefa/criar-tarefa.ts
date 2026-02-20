import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Tarefa, TarefasService } from '../../services/tarefas/tarefas';

@Component({
  selector: 'app-criar-tarefa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './criar-tarefa.html',
  styleUrl: './criar-tarefa.scss',
})
export class CriarTarefaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tarefasService = inject(TarefasService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  tarefas: Tarefa[] = [];
  loading = false;
  submitting = false;
  error = '';
  success = '';
  modalOpen = false;
  sidebarCollapsed = false;

  form = this.fb.group({
    descricao: ['', [Validators.required]],
    status_id: [3, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadTarefas();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  openModal(): void {
    this.error = '';
    this.success = '';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.form.reset({ descricao: '', status_id: 3 });
  }

  loadTarefas(): void {
    const cached = this.tarefasService.getAllCacheSnapshot();
    if (cached.length) {
      this.tarefas = cached;
      this.loading = false;
    } else {
      this.loading = true;
    }

    this.tarefasService.listAll(true).subscribe({
      next: (data) => {
        this.tarefas = data;
      },
      error: () => {
        this.error = 'Falha ao carregar tarefas';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  submit(): void {
    this.error = '';
    this.success = '';
    if (this.form.invalid) return;

    const { descricao, status_id } = this.form.getRawValue();
    if (!descricao || !status_id) return;

    const statusId = Number(status_id);
    const tempId = -Date.now();
    const tempTask: Tarefa = {
      id: tempId,
      descricao,
      criado_por: this.auth.getLoggedUserId() ?? 0,
      criado_por_nome: this.auth.getLoggedUserName(),
      status_id: statusId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      finalizado_em: statusId === 1 ? new Date().toISOString() : null,
      finalizado_por: statusId === 1 ? this.auth.getLoggedUserId() : null,
    };

    this.tarefas = [tempTask, ...this.tarefas];
    this.tarefasService.prependTaskToAllCache(tempTask);
    this.closeModal();
    this.submitting = true;
    this.tarefasService.create(descricao, statusId).subscribe({
      next: (res) => {
        const tarefaReal: Tarefa = {
          id: res.id,
          descricao,
          criado_por: this.auth.getLoggedUserId() ?? 0,
          criado_por_nome: this.auth.getLoggedUserName(),
          status_id: statusId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          finalizado_em: statusId === 1 ? new Date().toISOString() : null,
          finalizado_por: statusId === 1 ? this.auth.getLoggedUserId() : null,
        };

        this.tarefas = this.tarefas.map((item) => (item.id === tempId ? tarefaReal : item));
        this.tarefasService.replaceTaskInAllCache(tempId, tarefaReal);
        this.success = 'Tarefa criada com sucesso.';
      },
      error: (err) => {
        this.tarefas = this.tarefas.filter((item) => item.id !== tempId);
        this.tarefasService.removeTaskFromAllCache(tempId);
        this.error = err?.error?.message ?? 'Falha ao criar tarefa';
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  getStatusNome(statusId: number): string {
    const statusMap: Record<number, string> = {
      1: 'Finalizada',
      2: 'Em andamento',
      3: 'Nao iniciada',
      4: 'Cancelado',
    };
    return statusMap[statusId] ?? 'Desconhecido';
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
