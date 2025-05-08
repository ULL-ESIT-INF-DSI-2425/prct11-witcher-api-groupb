import request from 'supertest';
import { describe, test, expect } from 'vitest';
import { app } from '../src/app.js';

const merchantData = {
  ID: 2001,
  nombre: 'Agustin',
  tipo: 'Gorrilla',
  ubicacion: 'Tscoronte'
};

describe('Pruebas de la API de Merchants', () => {
  test('Crear un nuevo merchant', async () => {
    const response = await request(app)
      .post('/merchants')
      .send(merchantData);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe(merchantData.nombre);
    expect(response.body.ID).toBe(merchantData.ID);
  });

  test('Obtener un merchant por nombre', async () => {
    const response = await request(app)
      .get('/merchants')
      .query({ nombre: merchantData.nombre });

    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe(merchantData.nombre);
  });

  test('Modificar un merchant por nombre', async () => {
    // Crear merchant
    const nuevoMerchant = {
      ID: 2020,
      nombre: 'Valeria',
      tipo: 'Alquimista',
      ubicacion: 'San Lorenzo',
    };
    await request(app).post('/merchants').send(nuevoMerchant);
  
    // Modificar
    const response = await request(app)
      .patch('/merchants')
      .send({ nombre: 'Valeria', tipo: 'Carnicero', ubicacion: 'Santa cruz' });
  
    expect(response.status).toBe(200);
    expect(response.body.tipo).toBe('Carnicero');
    expect(response.body.ubicacion).toBe('Santa cruz');
  });  

  test('Eliminar un merchant por nombre', async () => {
    const response = await request(app)
      .delete('/merchants')
      .send({ nombre: merchantData.nombre });

    expect(response.status).toBe(200);
    expect(response.body.mensaje).toMatch(/eliminado/i);
  });

  test('Error al crear un merchant con ID duplicado', async () => {
    const merchantData = {
      ID: 4001,
      nombre: 'Ayoze',
      tipo: 'Prestamista',
      ubicacion: 'Arona'
    };

    // Primer intento (debe funcionar)
    const first = await request(app).post('/merchants').send(merchantData);
    expect(first.status).toBe(200);

    // Segundo intento con el mismo ID (debe fallar)
    const second = await request(app).post('/merchants').send(merchantData);
    expect(second.status).toBe(400);
  });

  test('Error al modificar un merchant inexistente', async () => {
    const patchResponse = await request(app)
      .patch('/merchants')
      .send({
        nombre: 'Inexistente',
        tipo: 'Pescador',
        ubicacion: 'Añaza'
      });

    expect(patchResponse.status).toBe(404);
    expect(patchResponse.body.error).toMatch(/no encontrado/i);
  });
});
