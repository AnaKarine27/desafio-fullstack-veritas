# Desafio Fullstack - Mini Kanban de Tarefas (Veritas)

Projeto fullstack de um simples quadro Kanban, desenvolvido como parte do desafio técnico da Veritas.

A aplicação permite **criar, ler, atualizar e excluir (CRUD)** tarefas, movendo-as entre três colunas fixas:  
**"A Fazer"**, **"Em Progresso"** e **"Concluídas"**.  

O **frontend** é construído em **React** e o **backend** em **Go**.

## Índice
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Rodar o Projeto Localmente](#como-rodar-o-projeto-localmente)
- [Decisões Técnicas](#decisões-técnicas)
- [Limitações e Melhorias Futuras](#limitações-e-melhorias-futuras)

## Tecnologias Utilizadas
**Backend:** Go (utilizando a biblioteca padrão `net/http` e `google/uuid`)  
**Frontend:** React (Vite) + Context API  
**Armazenamento:** Em memória (thread-safe com `sync.Mutex`) com persistência em arquivo JSON.

## Como Rodar o Projeto Localmente

Você precisará ter **Go (v1.2x+)** e **Node.js (v18+)** instalados.

### 1. Clone o Repositório

```
# Em seu terminal, clone este repositório
git clone https://github.com/AnaKarine27/desafio-fullstack-veritas.git

# Acesse a pasta do projeto
cd desafio-fullstack-veritas

```

### 2. Backend (Go)
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
### 3. Frontend (React)
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

**Gerenciamento de Status no Formulário**  

O desafio exige validação de status. Para atender a isso e focar em uma UX intuitiva, a validação foi implementada em duas camadas:

- **Frontend:** No ``TaskFormModal``, foi incluído um campo ``<select>`` para o Status. Esta é uma decisão pensada na UX:  
    **Previne Erros:** Impede que o usuário digite um status inválido, guiando-o para as escolhas corretas.  
    **Flexibilidade na Criação:** Permite ao usuário criar uma tarefa e já defini-la como "Em Progresso" ou "Concluída", em vez de forçá-lo a criar e depois movê-la.  
    **Eficiência na Edição:** Permite alterar o título, a descrição e o status de uma vez só, sem precisar fechar o modal e usar o botão "Mover".

- **Backend:** O ``handlers.go`` implementa uma segunda camada de validação, garantindo a integridade dos dados caso a API seja chamada diretamente.

## Limitações e Melhorias Futuras

**Limitação:** Persistência local em ``tasks.json``  
**Melhoria Futura:** Migrar para um banco de dados (ex: SQLite ou PostgreSQL)  	

**Limitação:** Movimentação de tarefas por botões ``(“Mover »”)``  
**Melhoria Futura:** 	Implementar Drag and Drop para melhor UX

**Limitação:** Aplicação sem autenticação (Kanban público)  
**Melhoria Futura:** Adicionar sistema de login/registro com JWT
