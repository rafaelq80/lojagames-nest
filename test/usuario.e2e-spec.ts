import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createTestingApp
} from '../src/data/services/test.service';

describe('Testes dos Módulos Usuário e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar Usuario', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' ',
        dataNascimento: '2000-02-20',
      });
    expect(201);

    usuarioId = resposta.body.id;
  });

  it('02 - Deve Autenticar Usuario (Login)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/usuarios/logar')
      .send({
        usuario: 'root@root.com',
        senha: 'rootroot',
      });
    expect(200);

    token = resposta.body.token;
  });

  it('03 - Não Deve Duplicar o Usuário', async () => {
    return request(app.getHttpServer())
      .post('/usuarios/cadastrar')
      .send({
        nome: 'Root',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' ',
        dataNascimento: '2000-02-20',
      })
      .expect(400);
  });

  it('04 - Deve Listar todos os Usuários', async () => {
    return request(app.getHttpServer())
      .get('/usuarios/all')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

  it('05 - Deve Atualizar um Usuário', async () => {
    return request(app.getHttpServer())
      .put('/usuarios/atualizar')
      .set('Authorization', `${token}`)
      .send({
        id: usuarioId,
        nome: 'Root Atualizado',
        usuario: 'root@root.com',
        senha: 'rootroot',
        foto: ' ',
        dataNascimento: '2000-02-20',
      })
      .expect(200)
      .then((resposta) => {
        expect('Root Atualizado').toEqual(resposta.body.nome);
      });
  });

  it('06 - Deve Listar um Usuário pelo ID', async () => {
    return request(app.getHttpServer())
      .get(`/usuarios/${usuarioId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200);
  });

});
