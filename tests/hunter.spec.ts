import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { app } from "../src/app";

const baseURL = "/hunter/hunters";
let id: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL as string);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("No se ha conectado a la base de datos.");
  }

  await db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Rutas /hunter/hunters", () => {
  test("POST /hunter/hunters - crea un cazador", async () => {
    const res = await request(app).post(baseURL).send({
      ID: 1,
      nombre: "Geralt",
      raza: "Humano",
      ubicacion: "Kaer Morhen",
    });
    expect(res.status).toBe(200);
    id = res.body._id;
  });

  test("GET /hunter/hunters?_id=id - devuelve un cazador", async () => {
    const res = await request(app).get(`${baseURL}?_id=${id}`);
    expect(res.status).toBe(200);
    expect(res.body[0].nombre).toBe("Geralt");
  });

  test("PATCH /hunter/hunters - actualiza un cazador", async () => {
    const res = await request(app).patch(baseURL).send({
      _id: id,
      ubicacion: "Novigrado",
    });
    expect(res.status).toBe(200);
    expect(res.body.ubicacion).toBe("Novigrado");
  });

  test("DELETE /hunter/hunters - elimina un cazador", async () => {
    const res = await request(app).delete(baseURL).send({ _id: id });
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe("Eliminado");
  });

  test("GET /hunter/hunters?_id=id - devuelve 404 si no existe", async () => {
    const res = await request(app).get(`${baseURL}?_id=${id}`);
    expect(res.status).toBe(404);
  });
});
