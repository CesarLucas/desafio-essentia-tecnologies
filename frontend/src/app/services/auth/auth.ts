import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  id: number;
  nome: string;
  email: string;
}

interface UpdatePasswordResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  register(nome: string, email: string, senha: string) {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/criar-usuario`, {
      nome,
      email,
      senha,
    });
  }

  login(email: string, senha: string) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { email, senha });
  }

  updatePassword(email: string, novaSenha: string) {
    return this.http.patch<UpdatePasswordResponse>(`${this.baseUrl}/auth/atualizar-senha`, {
      email,
      novaSenha,
    });
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
