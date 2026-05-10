// tests/integration.test.js
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');  
const User = require('../src/models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

//afterEach(async () => {
    //await mongoose.connection.db.dropDatabase();
//});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Fluxo de Blogging Escola (TDD)', () => {
    let tokenProfessor;
    let tokenAluno;

    // 1. Preparação: Criar usuários
    it('Deve registrar um professor e um aluno', async () => {
        // Criar professor diretamente no banco para obter o primeiro token de gestão
        await User.create({
            nome: 'Prof. Natalicio', email: 'profnatal@escola.com', senha: '123', role: 'professor'
        });
        
        //Login professor
        const resProf = await request(app).post('/auth/login').send({
            email: 'profnatal@escola.com', senha: '123'
        });
        // Se falhar, mostra o erro no terminal
        if (resProf.status !== 200) console.error("ERRO LOGIN PROF:", resProf.body);
        tokenProfessor = resProf.body.token;

        //Criar Aluno
        const regAluno = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${tokenProfessor}`)
        .send({
            nome: 'Ulisses', email: 'alunouli@escola.com', senha: '123', role: 'aluno'
        });
        if (regAluno.status !== 200) console.error("ERRO REGISTRO ALUNO:", regAluno.body);

        // Login ALuno
        const resAluno = await request(app).post('/auth/login').send({
            email: 'alunouli@escola.com', senha: '123'
        });
        if (resAluno.status !== 200) console.error("ERRO LOGIN ALUNO:", resAluno.body);
        tokenAluno = resAluno.body.token;

        expect(tokenProfessor).toBeDefined();
        expect(tokenAluno).toBeDefined();
    });

    it('Nao deve REGISTRAR usuario sem autenticacao de professor', async () => {
        const resSemToken = await request(app).post('/auth/register').send({
            nome: 'Sem Token', email: 'semtoken@escola.com', senha: '123', role: 'aluno'
        });

        const resAluno = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({
            nome: 'Aluno Criando', email: 'alunocriando@escola.com', senha: '123', role: 'aluno'
        });

        expect(resSemToken.statusCode).toEqual(401);
        expect(resAluno.statusCode).toEqual(403);
    });

    it('Nao deve LISTAR usuarios sem autenticacao', async () => {
        const res = await request(app)
        .get('/users');

        expect(res.statusCode).toEqual(401);
    });

    it('Deve LISTAR usuarios autenticado com filtros de nome, email e role', async () => {
        const res = await request(app)
        .get('/users')
        .query({ nome: 'natal', email: 'profnatal', role: 'professor' })
        .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].nome).toBe('Prof. Natalicio');
        expect(res.body[0].email).toBe('profnatal@escola.com');
        expect(res.body[0].role).toBe('professor');
        expect(res.body[0]).not.toHaveProperty('senha');
    });

    it('Deve BUSCAR usuario por ID autenticado', async () => {
        const listUsers = await request(app)
        .get('/users')
        .query({ email: 'profnatal@escola.com' })
        .set('Authorization', `Bearer ${tokenProfessor}`);

        const userId = listUsers.body[0]._id;

        const res = await request(app)
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenAluno}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBe(userId);
        expect(res.body.email).toBe('profnatal@escola.com');
        expect(res.body).not.toHaveProperty('senha');
    });

    it('Professor deve conseguir ATUALIZAR um usuario existente', async () => {
        const regUser = await request(app)
        .post('/auth/register')
        .set('Authorization', `Bearer ${tokenProfessor}`)
        .send({
            nome: 'Usuario Temporario', email: 'temporario@escola.com', senha: '123', role: 'aluno'
        });

        const userId = regUser.body.user._id;

        const res = await request(app)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenProfessor}`)
        .send({
            nome: 'Usuario Atualizado',
            email: 'usuario.atualizado@escola.com',
            role: 'professor'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.nome).toBe('Usuario Atualizado');
        expect(res.body.email).toBe('usuario.atualizado@escola.com');
        expect(res.body.role).toBe('professor');
        expect(res.body).not.toHaveProperty('senha');
    });

    it('Aluno nao deve conseguir ATUALIZAR usuario', async () => {
        const listUsers = await request(app)
        .get('/users')
        .query({ email: 'usuario.atualizado@escola.com' })
        .set('Authorization', `Bearer ${tokenProfessor}`);

        const userId = listUsers.body[0]._id;

        const res = await request(app)
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({ nome: 'Tentativa Aluno' });

        expect(res.statusCode).toEqual(403);
    });

    it('Professor deve conseguir EXCLUIR um usuario existente', async () => {
        const listUsers = await request(app)
        .get('/users')
        .query({ email: 'usuario.atualizado@escola.com' })
        .set('Authorization', `Bearer ${tokenProfessor}`);

        const userId = listUsers.body[0]._id;

        const res = await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${tokenProfessor}`);

        expect(res.statusCode).toEqual(204);
    });

    // 2. Teste de Permissão (Professor)
    it('Professor deve conseguir CRIAR um post', async () => {
        const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenProfessor}` )
        .send({
            titulo: 'Aula de História',
            conteudo: 'Revolução Industrial',
            autor: 'Prof. Natalicio'
        });
        if (res.status !== 201) console.error("ERRO CRIAR POST:", res.body);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
    });

    it('Professor deve conseguir CRIAR um post com quebra de linha no conteudo', async () => {
        const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenProfessor}` )
        .send({
            titulo: 'Aula de Portugues',
            conteudo: 'Primeiro paragrafo.\nSegundo paragrafo.',
            autor: 'Prof. Natalicio'
        });

        expect(res.statusCode).toEqual(201);
        expect(res.body.conteudo).toBe('Primeiro paragrafo.\nSegundo paragrafo.');
    });

    it('Deve retornar erro claro quando o JSON vier com quebra de linha literal invalida', async () => {
        const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenProfessor}` )
        .set('Content-Type', 'application/json')
        .send('{"titulo":"Aula","conteudo":"Primeiro paragrafo.\nSegundo paragrafo.","autor":"Prof. Natalicio"}');

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain('use \\n');
    });

    //3. Teste de Bloqueio (Aluno)
    it('Aluno não deve conseguir CRIAR um post', async () => {
        const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({
            titulo: 'Como Fraudar a Nota',
            conteudo: 'usando a esperteza na hora do fraudar para passar de ano',
            autor: 'Ulisses'
        });
        expect(res.statusCode).toEqual(403); // Forbbiden
    });

    //4. Teste de Leitura (Todos)
    it('Aluno deve conseguir LISTAR posts', async () => {
        const res = await request(app)
            .get('/posts');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
