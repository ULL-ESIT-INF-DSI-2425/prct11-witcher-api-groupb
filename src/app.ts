import express from 'express';
import './db/mongoose.js'; // Se conecta a MongoDB local

// Routers: 
import { defaultRouter } from "./routers/default.js";
import huntersRouter from './routers/hunter.js';
import merchantsRouter from './routers/merchant.js';
import transactionsRouter from './routers/transactions.js';
import bienRouter from './routers/bien.js';

export const app = express();
const port = 3000;

app.use(express.json());

// Rutas
app.use('/hunter', huntersRouter);
app.use('/merchant', merchantsRouter);
app.use('/transaction', transactionsRouter);
app.use('/bien', bienRouter);

// Control
app.use(defaultRouter);