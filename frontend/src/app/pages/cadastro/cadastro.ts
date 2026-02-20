import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss',
})
export class CadastroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  error = '';
  success = '';
  loading = false;

  form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error = '';
    this.success = '';
    if (this.form.invalid) return;

    const { nome, email, senha } = this.form.getRawValue();
    if (!nome || !email || !senha) return;

    this.loading = true;
    this.auth.register(nome, email, senha).subscribe({
      next: () => {
        this.success = 'Usuario criado com sucesso. Faça login.';
        this.form.reset();
        this.loading = false;
        setTimeout(() => this.router.navigateByUrl('/login'), 800);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao criar usuario';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
