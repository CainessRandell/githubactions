# fivam API

API REST para gestão de postagens escolares, com autenticação JWT, roles (professor/aluno) e documentação Swagger.

## Stack
- Node.js + Express
- MongoDB + Mongoose (MongoDB Atlas free tier, Cluster0/projeto fivam)
- JWT para auth
- Docker / Docker Compose
- Jest + Supertest
- GitHub Actions (test, Trivy, Docker, Render deploy)

## Funcionalidades
- Aluno (JWT obrigatório): listar posts, buscar por termo, ver post por id.
- Professor (JWT obrigatório): mesmas leituras e também criar, editar e excluir posts.

## Endpoints úteis
- API local: `http://localhost:3000`
- Swagger docs (prod Render free tier): `https://fivam-backend-fiap-0-0-2.onrender.com/api-docs/`

## Executar local (Docker)
Pré-requisitos: Docker e Docker Compose.

1) Clone:
```bash
git clone git@github.com:CainessRandell/githubactions.git
```
2) `.env` na raiz:
```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/blogging_escola
SECRET=segredo_super_secreto
```
3) Suba:
```bash
docker-compose up --build
```

## Testes
```bash
npm install
npm test
```
- Cobertura mínima global exigida: 20% (Jest).

## CI/CD (GitHub Actions)
Arquivo: `.github/workflows/ci.yml`
- **test**: `npm ci` + `npm test` (falha se <20% de cobertura).
- **trivy**: scan HIGH/CRITICAL no filesystem.
- **docker**: build/push `rm369075/fivam-backend-fiap` com tag da ref (e `latest` no `main`).
- **render**: `POST https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys` com `imageUrl` publicado.

### Secrets necessários
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`

## Infra / ambientes
- Render (free tier, balanceado): `https://fivam-backend-fiap-0-0-2.onrender.com/api-docs/`
- Docker Hub (free tier): `https://hub.docker.com/repositories/rm369075`
- MongoDB Atlas: Cluster0 (projeto fivam), free tier.

## Config para Render (exemplo)
- `PORT`: 8080
- `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.tkbzawz.mongodb.net/?appName=Cluster0` (substitua credenciais)
  
## Desafios e aprendizados no desenvolvimento da Fivam API
Durante o projeto da Fivam API, enfrentamos diversos desafios técnicos que auxiliaram no crescimento de nossas habilidades.

- 1. Arquitetura e segurança da aplicação
Foi adotada uma arquitetura limpa, com boa separação de perfis por usuário. Implementamos controle de acesso baseado em perfis e autenticação via JWT.

- 2. Docker
A criação da imagem para execução em Docker foi essencial. Tivemos que realizar diversos ajustes para tornar o ambiente local idêntico ao de integração contínua, evitando o clássico problema do “na minha máquina funciona”.

- 3. Segurança
Incorporamos ferramentas de análise de vulnerabilidades desde as fases iniciais do projeto. Essa prática mudou a mentalidade da equipe, fazendo com que a segurança deixasse de ser tratada apenas ao final e passasse a integrar naturalmente o processo de desenvolvimento.

- 4. Deploy automatizado no Render
A principal dificuldade foi tornar o deploy automatizado via webhook do Render confiável. O feedback fornecido pela ferramenta é limitado, o que exigiu várias rodadas de tentativa e erro, validações manuais e ajustes até que o processo se tornasse estável.
