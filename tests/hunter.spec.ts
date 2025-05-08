import request from 'supertest';
import { describe, test, expect } from 'vitest';
import { app } from '../src/app.js';

describe('Pruebas de la API de Hunters', () => {
  const hunterData = {
    ID: 1001,
    nombre: 'Gustavo',
    raza: 'Humano',
    ubicacion: 'Candelaria'
  };

  test('Crear un nuevo hunter', async () => {
    const response = await request(app)
      .post('/hunters')
      .send(hunterData);

    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe(hunterData.nombre);
    expect(response.body.ID).toBe(hunterData.ID);
  });

  test('Obtener un hunter por nombre', async () => {
    const response = await request(app)
      .get('/hunters')
      .query({ nombre: hunterData.nombre });

    expect(response.status).toBe(200);
    expect(response.body[0].nombre).toBe(hunterData.nombre);
  });

  test('Modificar un hunter por nombre', async () => {
    // Crear hunter
    const nuevoHunter = {
      ID: 1010,
      nombre: 'Leo',
      raza: 'Humano',
      ubicacion: 'Ofra',
    };
    await request(app).post('/hunters').send(nuevoHunter);
  
    // Modificar
    const response = await request(app)
      .patch('/hunters')
      .send({ nombre: 'Leo', raza: 'Mutante', ubicacion: 'Chimisai' });
  
    expect(response.status).toBe(200);
    expect(response.body.raza).toBe('Mutante');
    expect(response.body.ubicacion).toBe('Chimisai');
  });  
  
  test('Eliminar un hunter por nombre', async () => {
    const response = await request(app)
      .delete('/hunters')
      .send({ nombre: hunterData.nombre });

    expect(response.status).toBe(200);
    expect(response.body.mensaje).toMatch(/eliminado/i);
  });

  test('Error al crear un hunter con ID duplicado', async () => {
    const hunter = {
      ID: 1234,
      nombre: 'Carlos',
      raza: 'Humano',
      ubicacion: 'Igueste'
    };

    const first = await request(app).post('/hunters').send(hunter);
    expect(first.status).toBe(200);

    const second = await request(app).post('/hunters').send(hunter);
    expect(second.status).toBe(400);
  });

  test('Error al modificar un hunter inexistente', async () => {
    const response = await request(app)
      .patch('/hunters')
      .send({
        nombre: 'Inexistente',
        ubicacion: 'Radazul'
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toMatch(/no encontrado/i);
  });
});
