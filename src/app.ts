import express from "express";
import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/posada-app";

// Middleware para manejar errores
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URL)
    .then(() => console.log("✅ Connected to the database"))
    .catch(() => console.log("❌ Error connecting to the database"));
}

// Routers:
import { defaultRouter } from "./routers/default.js";
import huntersRouter from "./routers/hunter.js";
import merchantsRouter from "./routers/merchant.js";
import transactionsRouter from "./routers/transactions.js";
import bienRouter from "./routers/bien.js";

export const app = express();
// const port = 3000;

app.use(express.json());

// Rutas
app.use(huntersRouter);
app.use(merchantsRouter);
app.use(transactionsRouter);
app.use(bienRouter);

// Control
app.use(defaultRouter);
