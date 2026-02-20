import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  error = '';
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error = '';
    if (this.form.invalid) return;

    const { email, senha } = this.form.getRawValue();
    if (!email || !senha) return;

    this.loading = true;
    this.auth.login(email, senha).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigateByUrl('/tarefas');
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Falha no login';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
