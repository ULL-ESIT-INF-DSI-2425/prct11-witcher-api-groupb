import request from 'supertest';
import { describe, test, expect } from 'vitest';
import { app } from '../src/app.js';

const bienData = {
  ID: 101,
  nombre: 'Espada de Plata',
  descripcion: 'Una espada forjada especialmente para matar monstruos.',
  material: 'Plata',
  peso: 2.5,
  precio: 100,
  stock: 10
};

describe('Pruebas de la API de Bienes', () => {
  test('Crear un nuevo bien', async () => {
    const response = await request(app)
      .post('/bienes')
      .send(bienData);

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(bienData.nombre);
  });

  test('Obtener un bien por nombre', async () => {
    const response = await request(app)
      .get('/bienes')
      .query({ nombre: bienData.nombre });

    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe(bienData.nombre);
  });

  test('Modificar un bien por nombre', async () => {
    const response = await request(app)
      .patch('/bienes')
      .send({
        nombre: bienData.nombre,
        precio: 120,
        stock: 5
      });

    expect(response.status).toBe(200);
    expect(response.body.precio).toBe(120);
    expect(response.body.stock).toBe(5);
  });

  test('Eliminar un bien por nombre', async () => {
    const response = await request(app)
      .delete('/bienes')
      .send({ nombre: bienData.nombre });

    expect(response.status).toBe(200);
    expect(response.body.mensaje).toMatch(/eliminado/i);
  });

  test('Error al crear un bien con peso negativo', async () => {
    const response = await request(app).post('/bienes').send({
      ID: 3001,
      nombre: 'Espada Rota',
      descripcion: 'No sirve de mucho',
      material: 'Hierro oxidado',
      peso: -1.2,
      precio: 10,
      stock: 5
    });

    expect(response.status).toBe(400);
  });

  test('Error al modificar un bien inexistente', async () => {
    const response = await request(app)
      .patch('/bienes')
      .send({
        nombre: 'Inexistente',
        precio: 50
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/no encontrado/i);
  });

  test('Error al crear un bien con ID duplicado', async () => {
    const bien = {
      ID: 4002,
      nombre: 'Amuleto',
      descripcion: 'Protege contra el mal de ojo',
      material: 'Oro',
      peso: 0.1,
      precio: 250,
      stock: 3
    };

    const first = await request(app).post('/bienes').send(bien);
    expect(first.status).toBe(201);

    const second = await request(app).post('/bienes').send(bien);
    expect(second.status).toBe(400);
  });
});
