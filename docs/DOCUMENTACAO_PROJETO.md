# Documentacao Tecnica - TechX Tasks

## 1. Visao geral

Sistema web de tarefas com autenticacao JWT, backend em Node.js/TypeScript e frontend em Angular.

## 2. Arquitetura

### Backend
- `backend/src/app.ts`: bootstrap da API, CORS, JSON parser e rotas.
- `backend/src/routes`: definicao dos endpoints.
- `backend/src/controllers`: camada HTTP (request/response).
- `backend/src/services`: regras de negocio.
- `backend/src/repositories`: acesso ao MySQL.
- `backend/src/db`: schema e seed.
- `backend/src/middlewares/auth.middleware.ts`: validacao do token JWT.

### Frontend
- `frontend/src/app/pages`: telas (login, cadastro, tarefas, criar tarefa, atualizar senha).
- `frontend/src/app/services`: integracao HTTP com backend.
- `frontend/src/app/interceptors/auth.interceptor.ts`: injeta token Bearer.
- `frontend/src/app/guards/auth.guard.ts`: protege rotas autenticadas.

## 3. Banco de dados (MySQL)

### Tabelas
- `usuario`
- `status`
- `tarefa`

### Campo obrigatorio de vencimento
A tabela `tarefa` possui `vencimento_em DATE NOT NULL`.

## 4. Fluxo de autenticacao

1. Usuario realiza login em `POST /auth/login`.
2. Backend retorna JWT.
3. Frontend salva token em `localStorage`.
4. Interceptor envia `Authorization: Bearer <token>`.
5. Middleware valida token e injeta `userId` no request.

## 5. Regras de negocio

- Criar tarefa exige:
  - `descricao`
  - `vencimento_em` no formato `YYYY-MM-DD`
  - `status_id` valido
- Atualizar status: qualquer usuario autenticado.
- Atualizar descricao: somente criador.
- Excluir tarefa: somente criador.

## 6. Endpoints

### Auth
- `POST /auth/criar-usuario`
- `POST /auth/login`
- `PATCH /auth/atualizar-senha`

### Tarefas
- `GET /tarefas`
- `GET /tarefas/todas`
- `POST /tarefas`
- `PATCH /tarefas/:id/status`
- `PATCH /tarefas/:id/descricao`
- `DELETE /tarefas/:id`

## 7. Exemplo de requests

### Criar tarefa

```http
POST /tarefas
Authorization: Bearer <token>
Content-Type: application/json

{
  "descricao": "Revisar backlog",
  "vencimento_em": "2026-03-15",
  "status_id": 3
}
```

### Atualizar status

```http
PATCH /tarefas/10/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status_id": 1
}
```

### Atualizar descricao

```http
PATCH /tarefas/10/descricao
Authorization: Bearer <token>
Content-Type: application/json

{
  "descricao": "Revisar backlog e priorizar sprint"
}
```

## 8. Execucao local

### Backend

```bash
npm install
npm run dev
```

`npm run dev` executa `db:init` automaticamente (create database, schema, seed).

### Frontend

```bash
cd frontend
npm install
npm start
```

## 9. Solucao de problemas

### Erro ao criar tarefa
Verifique:
1. Campo `vencimento_em` preenchido.
2. Formato de data `YYYY-MM-DD`.
3. Token JWT valido no header.
4. Banco com schema atualizado (`npm run db:init`).

### Login lento
- Em desenvolvimento, hash bcrypt e latencia de rede local podem aumentar tempo percebido.
- Frontend usa `127.0.0.1` para reduzir atraso de resolucao de `localhost`.

## 10. Melhorias futuras

- Adicionar testes unitario backend.