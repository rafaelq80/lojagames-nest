import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authenticateUser, createTestingApp } from '../src/data/services/test.service';

describe('Testes do Módulo Produto (e2e)', () => {

  const produto = {
    nome: 'Halo',
    preco: 250.99,
    foto: '-',
    categoria: {
      id: 1,
    },
  }

  let token: any;
  let produtoId: any;
  let nome: string = 'Halo';
  let app: INestApplication;

  beforeAll(async () => {

    app = await createTestingApp();
    
    token = await authenticateUser(app);

    // Criar categoria para testar o módulo
    await request(app.getHttpServer())
      .post('/categorias')
      .set('Authorization', `${token}`)
      .send({
        tipo: 'E-Sports',
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar Produto', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/produtos')
      .set('Authorization', `${token}`)
      .send(produto);
    expect(201);

    produtoId = resposta.body.id;
  });

  it('02 - Deve Listar todos os Produtos', async () => {
    return request(app.getHttpServer())
      .get('/produtos')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('03 - Deve Listar um Produto pelo ID', async () => {
    return request(app.getHttpServer())
      .get(`/produtos/${produtoId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('04 - Deve Listar todos os Produtos pelo nome', async () => {
    return request(app.getHttpServer())
      .get(`/produtos/nome/${nome}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('05 - Deve Atualizar um Produto', async () => {
    return request(app.getHttpServer())
      .put('/produtos')
      .set('Authorization', `${token}`)
      .send({
        id: produtoId,
        nome: 'Tomb Raider',
        preco: 250.99,
        foto: '-',
        categoria: {
          id: 1,
        },
      })
      .expect(200)
      .then(resposta => {
        expect("Tomb Raider").toEqual(resposta.body.nome);
      });
  });

  it('06 - Deve Deletar um Produto', async () => {
    return request(app.getHttpServer())
      .delete(`/produtos/${produtoId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(204)
  });

});
