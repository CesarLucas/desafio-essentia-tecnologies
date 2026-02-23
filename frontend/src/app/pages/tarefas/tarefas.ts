import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Tarefa, TarefasService } from '../../services/tarefas/tarefas';

type FiltroStatus = 'all' | '1' | '2' | '3' | '4';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.scss',
})
export class TarefasComponent implements OnInit {
  private readonly tarefasService = inject(TarefasService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  tarefas: Tarefa[] = [];
  error = '';
  success = '';
  loading = false;
  sidebarCollapsed = false;
  filtroAtual: FiltroStatus = 'all';
  statusModalAberto = false;
  statusModalLoading = false;
  statusSelecionado = 2;
  descricaoModalAberto = false;
  descricaoModalLoading = false;
  novaDescricao = '';
  tarefaSelecionada: Tarefa | null = null;
  loggedUserName = '';
  loggedUserId: number | null = null;

  ngOnInit(): void {
    this.loggedUserName = this.auth.getLoggedUserName();
    this.loggedUserId = this.auth.getLoggedUserId();
    this.loadTarefas();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setFiltro(filtro: FiltroStatus): void {
    this.filtroAtual = filtro;
  }

  isFiltroAtivo(filtro: FiltroStatus): boolean {
    return this.filtroAtual === filtro;
  }

  get tarefasFiltradas(): Tarefa[] {
    if (this.filtroAtual === 'all') return this.tarefas;
    return this.tarefas.filter((tarefa) => tarefa.status_id.toString() === this.filtroAtual);
  }

get estatisticasPessoais() {
  const meuId = this.auth.getLoggedUserId();
  const minhasTarefas = this.tarefas.filter(t => t.criado_por === meuId);
  
  // Filtr apenas as tarefas ATIVAS (Ignoramos as Canceladas - ID 4)
  const tarefasAtivas = minhasTarefas.filter(t => t.status_id !== 4);
  
  if (tarefasAtivas.length === 0) {
    return { 
      porcentagem: 100, 
      concluidas: 0, 
      faltam: 0, 
      total: 0,
      isVazio: true 
    };
  }

  const concluidas = tarefasAtivas.filter(t => t.status_id === 1).length;
  const totalAtivas = tarefasAtivas.length;
  const porcentagem = Math.round((concluidas / totalAtivas) * 100);

  return { 
    porcentagem, 
    concluidas, 
    total: totalAtivas,
    faltam: totalAtivas - concluidas,
    isVazio: false 
  };
}

getCorBarra(): string {
  const p = this.estatisticasPessoais.porcentagem;
  if (p < 30) return '#ff7675'; // Vermelho
  if (p < 70) return '#fdcb6e'; // Amarelo
  return '#00b894';             // Verde
}

getClassePrazo(dataVencimento: string): string {
  if (!dataVencimento) return '';
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(dataVencimento);
  vencimento.setHours(0, 0, 0, 0);

  const diffTempo = vencimento.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return 'prazo-vencido'; 
  if (diffDias <= 3) return 'prazo-curto';  // 0-3 dias: Vermelho
  if (diffDias <= 10) return 'prazo-medio'; // 3-10 dias: Amarelo
  return 'prazo-longo';                     // +10 dias: Verde
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

  loadTarefas(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.tarefasService.listAll().subscribe({
      next: (data) => {
        this.tarefas = data;
        this.tarefasService.setAllCache(data);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao carregar tarefas';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  abrirModalStatus(tarefa: Tarefa): void {
    this.tarefaSelecionada = tarefa;
    this.statusSelecionado = tarefa.status_id;
    this.statusModalAberto = true;
    this.error = '';
  }

  fecharModalStatus(): void {
    this.statusModalAberto = false;
    this.tarefaSelecionada = null;
  }

  abrirModalDescricao(tarefa: Tarefa): void {
    this.tarefaSelecionada = tarefa;
    this.novaDescricao = tarefa.descricao;
    this.descricaoModalAberto = true;
    this.error = '';
  }

  fecharModalDescricao(): void {
    this.descricaoModalAberto = false;
    this.tarefaSelecionada = null;
    this.novaDescricao = '';
  }

  salvarStatus(): void {
    if (!this.tarefaSelecionada) return;

    const tarefaId = this.tarefaSelecionada.id;
    const novoStatus = this.statusSelecionado;
    const tarefaAtual = this.tarefas.find((tarefa) => tarefa.id === tarefaId);
    const statusAnterior = tarefaAtual?.status_id ?? novoStatus;
    this.statusModalLoading = true;
    this.error = '';
    this.success = '';

    this.tarefas = this.tarefas.map((tarefa) =>
      tarefa.id === tarefaId ? { ...tarefa, status_id: novoStatus } : tarefa
    );
    this.tarefasService.updateTaskInAllCache(tarefaId, { status_id: novoStatus });
    this.fecharModalStatus();

    this.tarefasService.updateStatus(tarefaId, novoStatus).subscribe({
      next: (res) => {
        this.success = res.message;
      },
      error: (err) => {
        this.tarefas = this.tarefas.map((tarefa) =>
          tarefa.id === tarefaId ? { ...tarefa, status_id: statusAnterior } : tarefa
        );
        this.tarefasService.updateTaskInAllCache(tarefaId, { status_id: statusAnterior });
        this.error = err?.error?.message ?? 'Falha ao atualizar status';
        this.statusModalLoading = false;
      },
      complete: () => {
        this.statusModalLoading = false;
      },
    });
  }

  excluirTarefa(tarefa: Tarefa): void {
    const confirmado = window.confirm(`Deseja excluir a tarefa #${tarefa.id}?`);
    if (!confirmado) return;

    this.error = '';
    this.success = '';

    const snapshot = [...this.tarefas];
    this.tarefas = this.tarefas.filter((item) => item.id !== tarefa.id);
    this.tarefasService.removeTaskFromAllCache(tarefa.id);

    this.tarefasService.remove(tarefa.id).subscribe({
      next: (res) => {
        this.success = res.message;
      },
      error: (err) => {
        this.tarefas = snapshot;
        this.tarefasService.setAllCache(snapshot);
        this.error = err?.error?.message ?? 'Falha ao excluir tarefa';
      },
    });
  }

  salvarDescricao(): void {
    if (!this.tarefaSelecionada) return;

    const tarefaId = this.tarefaSelecionada.id;
    const descricao = this.novaDescricao.trim();
    if (!descricao) {
      this.error = 'Descricao e obrigatoria';
      return;
    }

    const tarefaAtual = this.tarefas.find((tarefa) => tarefa.id === tarefaId);
    const descricaoAnterior = tarefaAtual?.descricao ?? '';
    this.descricaoModalLoading = true;
    this.error = '';
    this.success = '';

    this.tarefas = this.tarefas.map((tarefa) =>
      tarefa.id === tarefaId ? { ...tarefa, descricao } : tarefa
    );
    this.tarefasService.updateTaskInAllCache(tarefaId, { descricao });
    this.fecharModalDescricao();

    this.tarefasService.updateDescription(tarefaId, descricao).subscribe({
      next: (res) => {
        this.success = res.message;
      },
      error: (err) => {
        this.tarefas = this.tarefas.map((tarefa) =>
          tarefa.id === tarefaId ? { ...tarefa, descricao: descricaoAnterior } : tarefa
        );
        this.tarefasService.updateTaskInAllCache(tarefaId, { descricao: descricaoAnterior });
        this.error = err?.error?.message ?? 'Falha ao atualizar descricao';
        this.descricaoModalLoading = false;
      },
      complete: () => {
        this.descricaoModalLoading = false;
      },
    });
  }

  trackByTarefaId(_index: number, tarefa: Tarefa): number {
    return tarefa.id;
  }

  canDelete(tarefa: Tarefa): boolean {
    return this.loggedUserId !== null && tarefa.criado_por === this.loggedUserId;
  }

  canEditDescription(tarefa: Tarefa): boolean {
    return this.loggedUserId !== null && tarefa.criado_por === this.loggedUserId;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
