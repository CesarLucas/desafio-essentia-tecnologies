import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { AtualizarSenhaComponent } from './pages/atualizar-senha/atualizar-senha';
import { TarefasComponent } from './pages/tarefas/tarefas';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tarefas' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'atualizar-senha', component: AtualizarSenhaComponent },
  { path: 'tarefas', component: TarefasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'tarefas' },
];
