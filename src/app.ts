import express from "express";
import './db/mongoose.js';

// Routers:
import { defaultRouter } from "./routers/default.js";
import huntersRouter from "./routers/hunter.js";
import merchantsRouter from "./routers/merchant.js";
import transactionsRouter from "./routers/transactions.js";
import bienRouter from "./routers/bien.js";

export const app = express();

app.use(express.json());

// Rutas
app.use(huntersRouter);
app.use(merchantsRouter);
app.use(transactionsRouter);
app.use(bienRouter);

// Control
app.use(defaultRouter);
