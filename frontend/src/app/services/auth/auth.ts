import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
}

interface TokenPayload {
  userId?: number;
  nome?: string;
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

  getLoggedUserId(): number | null {
    const payload = this.getTokenPayload();
    return typeof payload?.userId === 'number' ? payload.userId : null;
  }

  getLoggedUserName(): string {
    const payload = this.getTokenPayload();
    return payload?.nome?.trim() || 'Usuario';
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getTokenPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;

    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      return JSON.parse(json) as TokenPayload;
    } catch {
      return null;
    }
  }
}
