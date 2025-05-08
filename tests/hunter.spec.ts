import mongoose from "mongoose";
import request from "supertest";
import type { Express } from "express";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

let app: Express;
const baseURL = "/hunters";
let createdId: string;

beforeAll(async () => {
  // 1) Conecta a la base de datos de test
  await mongoose.connect(process.env.MONGO_URL!);

  // 2) Limpia la BD entera
  await mongoose.connection.db!.dropDatabase();

  // 3) Importa la app una vez que la conexión está lista
  //    omitimos la extensión para que Vitest resuelva TS <-> JS
  const mod = await import("../src/app");
  app = mod.app;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Rutas /hunters", () => {
  test("POST   /hunters        → crea un cazador", async () => {
    const res = await request(app).post(baseURL).send({
      ID: 1,
      nombre: "Geralt",
      raza: "Humano",
      ubicacion: "Kaer Morhen",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    createdId = res.body._id;
  });

  test("GET    /hunters?_id=id  → devuelve el cazador creado", async () => {
    const res = await request(app).get(`${baseURL}?_id=${createdId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ nombre: "Geralt" });
  });

  test("PATCH  /hunters        → actualiza el cazador", async () => {
    const res = await request(app)
      .patch(baseURL)
      .send({ _id: createdId, ubicacion: "Novigrado" });
    expect(res.status).toBe(200);
    expect(res.body.ubicacion).toBe("Novigrado");
  });

  test("DELETE /hunters        → elimina el cazador", async () => {
    const res = await request(app).delete(baseURL).send({ _id: createdId });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ mensaje: "Eliminado" });
  });

  test("GET    /hunters?_id=id  → 404 tras borrarlo", async () => {
    const res = await request(app).get(`${baseURL}?_id=${createdId}`);
    expect(res.status).toBe(404);
  });
});
