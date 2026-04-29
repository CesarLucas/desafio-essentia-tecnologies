import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { CreateTarefaResponse, Tarefa, TarefasService } from '../../services/tarefas/tarefas';

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
  private readonly cdr = inject(ChangeDetectorRef)

  tarefas: Tarefa[] = [];
  loading = false;
  submitting = false;
  error = '';
  success = '';
  jsonResponse = '';
  modalOpen = false;
  sidebarCollapsed = false;
  dataMinima: string = '';

  form = this.fb.group({
    descricao: ['', [Validators.required]],
    vencimento_em: ['', [Validators.required]],
    status_id: [3, [Validators.required]],
  });

  ngOnInit(): void {
    this.configurarPrazos();
    this.loadTarefas();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  configurarPrazos(): void {
    const hoje = new Date();
    this.dataMinima = hoje.toISOString().split('T')[0];
  }

  openModal(): void {
    this.error = '';
    this.success = '';
    this.jsonResponse = '';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.form.reset({ descricao: '', vencimento_em: '', status_id: 3 });
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
    this.jsonResponse = '';
    if (this.form.invalid) return;

    const { descricao, vencimento_em, status_id } = this.form.getRawValue();
    if (!descricao || !vencimento_em || !status_id) return;

    const statusId = Number(status_id);
    this.submitting = true;
    this.tarefasService.create(descricao, vencimento_em, statusId).subscribe({
      next: (res: CreateTarefaResponse) => {
        const tarefaReal: Tarefa = {
          id: res.id,
          descricao,
          criado_por: this.auth.getLoggedUserId() ?? 0,
          criado_por_nome: this.auth.getLoggedUserName(),
          vencimento_em,
          status_id: statusId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          finalizado_em: statusId === 1 ? new Date().toISOString() : null,
          finalizado_por: statusId === 1 ? this.auth.getLoggedUserId() : null,
        };

        this.tarefas = [tarefaReal, ...this.tarefas];
        this.tarefasService.prependTaskToAllCache(tarefaReal);
        this.success = res.message || 'Tarefa criada com sucesso.';
        this.jsonResponse = JSON.stringify(res, null, 2);
        this.closeModal();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao criar tarefa';
        this.jsonResponse = JSON.stringify(err?.error ?? { message: this.error }, null, 2);
        this.submitting = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }

  getCorPrazo(dataVencimento: string): string {
  if (!dataVencimento) return '';
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(dataVencimento);
  vencimento.setHours(0, 0, 0, 0);

  const diffTempo = vencimento.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return 'prazo-vencido'; 
  if (diffDias <= 3) return 'prazo-curto';  // Vermelho
  if (diffDias <= 10) return 'prazo-medio'; // Amarelo
  return 'prazo-longo';                     // Verde
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

  formatarData(data: string): string {
    if (!data) return '-';
    const [ano, mes, dia] = data.slice(0, 10).split('-');
    if (!ano || !mes || !dia) return data;
    return `${dia}/${mes}/${ano}`;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
