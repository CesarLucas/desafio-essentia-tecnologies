# Desafio Essentia Technologies - TechX Tasks

Aplicacao web para gerenciamento de tarefas.

---

## Design & Protótipo
O projeto foi desenvolvido seguindo o protótipo desenhado no Figma, garantindo consistência visual e uma experiência de usuário intuitiva.

- **Link do Protótipo:** [Acesse o Figma aqui](https://www.figma.com/design/w7qm6EWkbRtwuCgA1GPaiE/TechX?m=auto&t=hrztoJAxA3O2dMwq-1)

---

- Backend: Node.js + TypeScript + Express + MySQL
- Frontend: Angular
- Autenticacao: JWT

## Requisitos

- Node.js 18+
- NPM 9+
- MySQL 8+

## Estrutura

- `backend/src`: API REST
- `backend/src/db/001_schema.sql`: schema do banco
- `backend/src/db/002_seed.sql`: dados iniciais da tabela `status`
- `backend/scripts/init-db.cjs`: script de inicializacao do banco
- `frontend/src`: aplicacao Angular

## Configuracao de ambiente

Configure o arquivo `backend/src/config/env/.env` com:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=techx_todo
JWT_SECRET=sua_chave_jwt
JWT_EXPIRES_IN=1d
```

## Executar backend

Na raiz do projeto:

```bash
npm install
npm run dev
```

O comando `npm run dev` executa automaticamente:
1. `db:init` (cria banco se necessario, aplica schema e seed)
2. sobe a API (`ts-node-dev`)

API: `http://localhost:3000`

Health check:

```bash
curl http://localhost:3000/health
```

## Executar frontend

No diretorio `frontend`:

```bash
npm install
npm start
```

Frontend: `http://localhost:4200`

## Endpoints principais

### Auth
- `POST /auth/criar-usuario`
- `POST /auth/login`
- `PATCH /auth/atualizar-senha`

### Tarefas
- `GET /tarefas` (tarefas do usuario logado)
- `GET /tarefas/todas` (todas as tarefas)
- `POST /tarefas`
- `PATCH /tarefas/:id/status`
- `PATCH /tarefas/:id/descricao`
- `DELETE /tarefas/:id`

## Exemplo de payloads

### Criar usuario

`POST /auth/criar-usuario`

```json
{
  "nome": "Cesar",
  "email": "cesar@email.com",
  "senha": "123456"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "cesar@email.com",
  "senha": "123456"
}
```

### Criar tarefa

`POST /tarefas`

Header:
- `Authorization: Bearer <token>`

Body:

```json
{
  "descricao": "Preparar apresentacao",
  "vencimento_em": "2026-03-10",
  "status_id": 3
}
```

## Regras de permissao

- Atualizar status: qualquer usuario autenticado
- Atualizar descricao: apenas criador da tarefa
- Excluir tarefa: apenas criador da tarefa
- Criar Tarefa: apenas data futura/atual pode ser inserida

## Funcionalidades Extras (UX/UI)
- **Cores Dinâmicas de Prazo**: 
  - Vermelho: 0-3 dias para o vencimento.
  - Amarelo: 3-10 dias para o vencimento.
  - Verde: Mais de 10 dias.

- **Barra de Progresso Inteligente**: Calcula a conclusão baseada apenas em tarefas ativas (Ignora automaticamente as canceladas).

- **Feedback Visual**: Tarefas finalizadas ou canceladas são exibidas com estilo "riscado" e tons acinzentados/roxos para facilitar o foco no que é importante.