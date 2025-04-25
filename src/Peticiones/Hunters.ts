import express from 'express';
import Hunter from '../Modelos/HuntersModel.js';

const router = express.Router();

// Crear
router.post('/', async (req, res) => {
  try {
    const hunter = new Hunter(req.body);
    await hunter.save();
    res.json(hunter);
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});

// Obtener todos
router.get('/', async (_, res) => {
  try {
    const hunters = await Hunter.find();
    res.json(hunters);
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});

// Buscar por nombre
router.get('/search', async (req, res) => {
  try {
    console.log(req.query);
    const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : '';
    if (!nombre) res.json({ error: 'Falta el nombre' });

    const hunter = await Hunter.findOne({ nombre });
    if (!hunter) res.json({ error: 'No encontrado' });

    res.json(hunter);
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const hunter = await Hunter.findById(req.params.id);
    if (!hunter) res.json({ error: 'No encontrado' });

    res.json(hunter);
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});

// Modificar por ID
router.patch('/:id', async (req, res) => {
  try {
    const hunter = await Hunter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hunter) res.json({ error: 'No encontrado' });

    res.json(hunter);
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});

// Borrar por ID
router.delete('/:id', async (req, res) => {
  try {
    const hunter = await Hunter.findByIdAndDelete(req.params.id);
    if (!hunter) res.json({ error: 'No encontrado' });

    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
});


export default router;