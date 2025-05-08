import request from 'supertest';
import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { app } from '../src/app.js';

let transaccionCreada: any;

const hunterData = {
  ID: 1001,
  nombre: 'Gustavo',
  raza: 'Humano',
  ubicacion: 'Candelaria',
};

const bienData = {
  ID: 2001,
  nombre: 'Espada de Plata',
  descripcion: 'Espada efectiva contra monstruos',
  material: 'Plata',
  peso: 2.5,
  precio: 150,
  stock: 10,
};

describe('Pruebas de la API de Transacciones', () => {
  beforeAll(async () => {
    await request(app).post('/hunters').send(hunterData);
    await request(app).post('/bienes').send(bienData);
  });

  beforeEach(async () => {
    const response = await request(app).post('/transactions').send({
      ID: Date.now(),
      nombrePersona: 'Gustavo',
      tipoPersona: 'Hunter',
      bienes: { nombre: 'Espada de Plata', cantidad: 1 },
      devolucion: false,
    });
    transaccionCreada = response.body;
  });

  test('Crear y obtener una transacción', async () => {
    const getResponse = await request(app)
      .get('/transactions')
      .query({ _id: transaccionCreada._id });

    expect(getResponse.status).toBe(200);
    expect(getResponse.body[0]._id).toBe(transaccionCreada._id);
  });

  test('Modificar cantidad de bienes en una transacción', async () => {
    const nuevaCantidad = 3;
    const patchResponse = await request(app)
      .patch('/transactions')
      .send({ _id: transaccionCreada._id, nuevaCantidad });

    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.bienes.cantidad).toBe(nuevaCantidad);
  });

  test('Eliminar una transacción', async () => {
    const deleteResponse = await request(app)
      .delete('/transactions')
      .send({ _id: transaccionCreada._id });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.mensaje).toMatch(/eliminada/i);
  });

  test('Error al crear transacción por stock insuficiente', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        ID: Date.now(),
        nombrePersona: 'Gustavo',
        tipoPersona: 'Hunter',
        bienes: { nombre: 'Espada de Plata', cantidad: 9999 },
        devolucion: false,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Stock insuficiente/i);
  });

  test('Error al modificar transacción con _id inválido', async () => {
    const response = await request(app)
      .patch('/transactions')
      .send({ _id: 'invalido123', nuevaCantidad: 2 });

    expect(response.status).toBe(500);
  });

  test('Error al eliminar transacción con _id inválido', async () => {
    const response = await request(app)
      .delete('/transactions')
      .send({ _id: 'invalido123' });

    expect(response.status).toBe(500);
  });
});
