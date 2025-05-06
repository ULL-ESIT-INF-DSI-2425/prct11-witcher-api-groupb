import express from 'express';
import './db/mongoose.js'; // Se conecta a MongoDB local

// Routers: 
import { defaultRouter } from "./routers/default.js";
import huntersRouter from './routers/hunter.js';
import merchantsRouter from './routers/merchant.js';
// Añadir los demas routers aqui (Peticiones)

export const app = express();
const port = 3000;

app.use(express.json());

// Rutas
app.use(huntersRouter);
app.use(merchantsRouter);
// Agregar '/bienes', '/transacciones'

// Control
app.use(defaultRouter);