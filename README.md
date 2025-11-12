# Desafio Fullstack - Mini Kanban de Tarefas (Veritas)

Projeto fullstack de um simples quadro Kanban, desenvolvido como parte do desafio técnico da Veritas.

A aplicação permite **criar, ler, atualizar e excluir (CRUD)** tarefas, movendo-as entre três colunas fixas:  
**"A Fazer"**, **"Em Progresso"** e **"Concluídas"**.  

O **frontend** é construído em **React** e o **backend** em **Go**.

---

## Índice
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
  - [Backend (Go)](#1-backend-go)
  - [Frontend (React)](#2-frontend-react)
- [Decisões Técnicas](#decisões-técnicas)
- [Limitações e Melhorias Futuras](#limitações-e-melhorias-futuras)

---

## Tecnologias Utilizadas
**Backend:** Go (utilizando a biblioteca padrão `net/http` e `google/uuid`)  
**Frontend:** React (Vite) + Context API  
**Armazenamento:** Em memória (thread-safe com `sync.Mutex`) com persistência em arquivo JSON.

---

## Como Rodar o Projeto Localmente

Você precisará ter **Go (v1.2x+)** e **Node.js (v18+)** instalados.

### 1. Backend (Go)
Em um terminal, navegue até a pasta do backend e rode os comandos abaixo:

```bash
# Navegue até a pasta do backend
cd backend

# Baixe as dependências
go mod tidy

# Rode o servidor
go run .

# ou (caso 'go run .' não funcione)
go run main.go handlers.go models.go

O servidor estará rodando em:  http://localhost:3333
```
### 2. Frontend (React)
Em outro terminal, navegue até a pasta do frontend e rode:

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências do Node
npm install

# Rode a aplicação
npm run dev

A aplicação estará disponível no endereço indicado (exemplo): http://localhost:5173
```
## Decisões Técnicas
Algumas decisões tomadas durante o desenvolvimento:

**Backend (Go)**

- Utilização apenas da biblioteca ``net/http`` para construir a API REST, sem frameworks externos, visando demonstrar domínio da linguagem e manter o código mais leve.
- Armazenamento das tarefas em memória com um ``map[string]Task``, garantindo segurança com ``sync.Mutex`` para operações concorrentes.

- Persistência em ``tasks.json`` (requisito bônus).
- Estrutura organizada em ``main.go, handlers.go e models.go``, separando inicialização, lógica de requisição e dados.

**Frontend (React)**
- Uso da Context API para gerenciamento de estado global ``(TaskProvider.jsx)``, centralizando toda a lógica de API (fetch, add, edit, move).

- Criação de hook customizado ``(useTaskContext)`` para consumir o contexto, tornando componentes como ``KanbanBoard`` e ``TaskCard`` mais limpos.

- Validação de status:

    No frontend, via ``<select>`` no TaskFormModal.jsx.

    No backend, via validação no handlers.go.


## Limitações e Melhorias Futuras

**Limitação:** Persistência local em ``tasks.json``  
**Melhoria Futura:** Migrar para um banco de dados (ex: SQLite ou PostgreSQL)  	

**Limitação:** Movimentação de tarefas por botões ``(“Mover »”)``  
**Melhoria Futura:** 	Implementar Drag and Drop para melhor UX

**Limitação:** Aplicação sem autenticação (Kanban público)  
**Melhoria Futura:** Adicionar sistema de login/registro com JWT