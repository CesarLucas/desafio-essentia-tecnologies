# Desafio Essentia Technologies - TechX Tasks

Aplicacao web de gerenciamento de tarefas com:
- Backend: Node.js + TypeScript + Express + MySQL
- Frontend: Angular
- Autenticacao: JWT

## Requisitos

- Node.js 18+
- NPM 9+
- MySQL 8+

## Estrutura

- `backend/src`: API REST
- `frontend/src`: interface Angular
- `backend/src/db/001_schema.sql`: criacao das tabelas
- `backend/src/db/002_seed.sql`: carga inicial de status

## Configuracao do backend

1. Ajuste as variaveis em `backend/src/config/env/.env`:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

2. Crie o banco e rode schema/seed.

Exemplo no PowerShell (com mysql.exe):

```powershell
Get-Content "C:\Users\cesar.lucas.silva\Projetos\essentia\desafio-essentia-tecnologies\backend\src\db\001_schema.sql" | .\mysql.exe -h 127.0.0.1 -P 3306 -u root -p techx_todo
Get-Content "C:\Users\cesar.lucas.silva\Projetos\essentia\desafio-essentia-tecnologies\backend\src\db\002_seed.sql" | .\mysql.exe -h 127.0.0.1 -P 3306 -u root -p techx_todo
```

## Executar backend

Na raiz do projeto:

```bash
npm install
npm run dev
```

API disponivel em `http://localhost:3000`.

## Executar frontend

No diretorio `frontend`:

```bash
npm install
npm start
```

Frontend disponivel em `http://localhost:4200`.

## Endpoints principais

### Auth
- `POST /auth/criar-usuario`
- `POST /auth/login`
- `PATCH /auth/atualizar-senha`

### Tarefas
- `GET /tarefas` (do usuario logado)
- `GET /tarefas/todas` (todas as tarefas)
- `POST /tarefas`
- `PATCH /tarefas/:id/status`
- `PATCH /tarefas/:id/descricao`
- `DELETE /tarefas/:id`

## Regras atuais

- Atualizar status: qualquer usuario autenticado.
- Atualizar descricao: apenas criador da tarefa.
- Excluir tarefa: apenas criador da tarefa.
