import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { authenticateUser, createTestingApp } from '../src/data/services/test.service';

describe('Testes do Módulo Categoria (e2e)', () => {

  const categoria = {
    tipo: 'Aventura',
  }

  let token: any;
  let categoriaId: any;
  let tipo: string = 'Aventura';
  let app: INestApplication;

  beforeAll(async () => {
    // Use the helper function to create the app
        app = await createTestingApp();
        
        // Get authentication token
        token = await authenticateUser(app);

  });

  afterAll(async () => {
    await app.close();
  });

  it('01 - Deve Cadastrar Categoria', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/categorias')
      .set('Authorization', `${token}`)
      .send(categoria);
    expect(201)

    categoriaId = resposta.body.id;

  });

  it('02 - Deve Listar todas as Categorias', async () => {
    return request(app.getHttpServer())
      .get('/categorias')
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('03 - Deve Listar uma Categoria pelo ID', async () => {
    return request(app.getHttpServer())
      .get(`/categorias/${categoriaId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('04 - Deve Listar todas as Categorias pelo tipo', async () => {
    return request(app.getHttpServer())
      .get(`/categorias/tipo/${tipo}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(200)
  });

  it('05 - Deve Atualizar uma Categoria', async () => {
    return request(app.getHttpServer())
      .put('/categorias')
      .set('Authorization', `${token}`)
      .send({
        id: categoriaId,
        tipo: 'Ação',
      })
      .expect(200)
      .then(resposta => {
        expect("Ação").toEqual(resposta.body.tipo);
      });
  });

  it('06 - Deve Deletar uma Categoria', async () => {
    return request(app.getHttpServer())
      .delete(`/categorias/${categoriaId}`)
      .set('Authorization', `${token}`)
      .send({})
      .expect(204)
  });

});