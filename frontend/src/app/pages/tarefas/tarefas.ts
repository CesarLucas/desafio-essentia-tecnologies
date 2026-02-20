import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { Tarefa, TarefasService } from '../../services/tarefas/tarefas';

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarefas.html',
  styleUrl: './tarefas.scss',
})
export class TarefasComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tarefasService = inject(TarefasService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  tarefas: Tarefa[] = [];
  error = '';
  loading = false;

  form = this.fb.group({
    descricao: ['', [Validators.required]],
    status_id: [2, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadTarefas();
  }

  loadTarefas() {
    this.loading = true;
    this.error = '';

    this.tarefasService.list().subscribe({
      next: (data) => {
        this.tarefas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao carregar tarefas';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  createTarefa() {
    this.error = '';
    if (this.form.invalid) return;

    const { descricao, status_id } = this.form.getRawValue();
    if (!descricao || !status_id) return;

    this.tarefasService.create(descricao, Number(status_id)).subscribe({
      next: () => {
        this.form.patchValue({ descricao: '', status_id: 2 });
        this.loadTarefas();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao criar tarefa';
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
