import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-atualizar-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './atualizar-senha.html',
  styleUrl: './atualizar-senha.scss',
})
export class AtualizarSenhaComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  error = '';
  success = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    novaSenha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error = '';
    this.success = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, novaSenha, confirmarSenha } = this.form.getRawValue();
    if (!email || !novaSenha || !confirmarSenha) return;

    if (novaSenha !== confirmarSenha) {
      this.error = 'As senhas nao conferem';
      return;
    }

    this.loading = true;
    this.auth.updatePassword(email, novaSenha).subscribe({
      next: (res) => {
        this.success = res.message;
        this.form.reset();
        setTimeout(() => this.router.navigateByUrl('/login'), 900);
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha ao atualizar senha';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
