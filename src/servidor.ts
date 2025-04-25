import express from 'express';
import './mongoose'; // Se conecta a MongoDB local

// Routers: 
import huntersRouter from './Peticiones/Hunters.js';
import merchantsRouter from './Peticiones/Merchants.js';
// Añadir los demas routers aqui (Peticiones)

const app = express();
const port = 3000;

app.use(express.json());

// Rutas
app.use('/hunters', huntersRouter);
app.use('/merchants', merchantsRouter);
// Agregae '/bienes', '/transacciones'

// Control
app.use((_req, res) => {
    res.json({ error: 'Ruta no encontrada' });
  });

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
