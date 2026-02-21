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


MySQL
Script Automático do Banco:
- `npm run dev` executa automaticamente `db:init` antes de subir a API.
- O `db:init` cria o banco (se nao existir), aplica `001_schema.sql` e `002_seed.sql`.

Teste rapido:

```bash 
- Apenas para merito de confirmação
curl http://localhost:3000/health
```
Caso de Erro:
- Configurar banco via terminal
1. Configure `backend/src/config/env/.env`:
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_USER=root`
- `DB_PASSWORD=...`
- `DB_NAME=techx_todo`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=1d`

2. Crie o banco:

```powershell
mysql -h 127.0.0.1 -P 3306 -u root -p -e "CREATE DATABASE IF NOT EXISTS techx_todo;"
```

3. Rode schema e seed.

Se `mysql` nao estiver no PATH, use o caminho completo para `mysql.exe`.
Exemplo no PowerShell:

```powershell
Get-Content ".\backend\src\db\001_schema.sql" | mysql -h 127.0.0.1 -P 3306 -u root -p techx_todo
Get-Content ".\backend\src\db\002_seed.sql" | mysql -h 127.0.0.1 -P 3306 -u root -p techx_todo
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
