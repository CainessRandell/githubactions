# Projeto Blogging Escola 🏫

Plataforma de API RESTful para gerenciamento de postagens escolares, permitindo que professores publiquem conteúdos e alunos visualizem e busquem materiais.

## 🚀 Tecnologias Utilizadas

* **Node.js & Express:** Framework backend.
* **MongoDB & Mongoose:** Banco de dados NoSQL e ODM.
* **JWT (JSON Web Tokens):** Autenticação e Autorização.
* **Docker & Docker Compose:** Containerização do ambiente.
* **Jest & Supertest:** Testes Automatizados (TDD).
* **GitHub Actions:** CI/CD Pipeline.

## ⚙️ Funcionalidades

### Públicas / Alunos
* `GET /posts`: Listar todas as postagens (mais recentes primeiro).
* `GET /posts/search?q=termo`: Buscar postagens por palavra-chave.
* `GET /posts/:id`: Ler uma postagem específica.

### Administrativas / Professores (Requer Token)
* `POST /posts`: Criar nova postagem.
* `PUT /posts/:id`: Editar postagem existente.
* `DELETE /posts/:id`: Excluir postagem.

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
* Docker e Docker Compose instalados.

### Passo a Passo
1.  Clone o repositório:
    ```bash
    git clone [https://github.com/new-psam/Blogging-escola.git](https://github.com/new-psam/Blogging-escola.git)
    cd Blogging-escola
    ```

2.  Crie o arquivo `.env` na raiz (se não existir) com:
    ```env
    PORT=3000
    MONGO_URI=mongodb://mongo:27017/blogging_escola
    SECRET=segredo_super_secreto
    ```

3.  Suba os containers:
    ```bash
    docker-compose up --build
    ```

A API estará disponível em: `http://localhost:3000`

## 🧪 Como Rodar os Testes

Para executar os testes de integração (TDD) que utilizam banco em memória:

```bash
# Rodar localmente (requer Node.js instalado)
npm install
npm test