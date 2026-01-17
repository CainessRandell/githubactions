// tests/integration.test.js
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../src/app');  
//const User = require('../src/models/User'); // Ainda vamos criar

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
        // Criar Professor
        const regProf = await request(app).post('/auth/register').send({
            nome: 'Prof. Natalicio', email: 'profnatal@escola.com', senha: '123', role: 'professor'
        });
        // Se falhar, mostra o erro no terminal
        if (regProf.status !== 200) console.error("ERRO REGISTRO PROF:", regProf.body);
        
        //Login professor
        const resProf = await request(app).post('/auth/login').send({
            email: 'profnatal@escola.com', senha: '123'
        });
        // Se falhar, mostra o erro no terminal
        if (resProf.status !== 200) console.error("ERRO LOGIN PROF:", resProf.body);
        tokenProfessor = resProf.body.token;

        //Criar Aluno
        await request(app).post('/auth/register').send({
            nome: 'Ulisses', email: 'alunouli@escola.com', senha: '123', role: 'aluno'
        });
        // Login ALuno
        const resAluno = await request(app).post('/auth/login').send({
            email: 'alunouli@escola.com', senha: '123'
        });
        if (resAluno.status !== 200) console.error("ERRO LOGIN ALUNO:", resAluno.body);
        tokenAluno = resAluno.body.token;

        expect(tokenProfessor).toBeDefined();
        expect(tokenAluno).toBeDefined();
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
            .get('/posts')
            .set('Authorization', `Bearer ${tokenAluno}`);
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });
});