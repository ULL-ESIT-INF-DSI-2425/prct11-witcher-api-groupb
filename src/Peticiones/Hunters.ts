import express from 'express';
import Hunter from '../Modelos/HuntersModel.js';

const router = express.Router();

// Crear
router.post('/', async (req, res) => {
  try {
    const hunter = new Hunter(req.body);
    await hunter.save();
    res.send(hunter);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos
router.get('/', async (_, res) => {
  try {
    const hunters = await Hunter.find();
    res.send(hunters);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener por nombre
router.get('/search', async (req, res) => {
  try {
    console.log(req.query);
    const nombre = typeof req.query.nombre === 'string' ? req.query.nombre : '';
    if(!nombre) {
      res.status(400).send({ error: 'Falta el nombre' });
    }

    const hunter = await Hunter.findOne({ nombre });
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const hunter = await Hunter.findById(req.params.id);
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Modificar por ID
router.patch('/:id', async (req, res) => {
  try {
    const hunter = await Hunter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Modificar por nombre
router.patch('/search', async (req, res) => {
  try {
    const nombre = typeof req.query.nombre === 'string';
    if(!nombre) {
      res.status(400).send({ error: 'Falta el nombre' });
    }

    const hunter = await Hunter.findOneAndUpdate({ nombre }, req.body, { new: true, runValidators: true });
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Borrar por ID
router.delete('/:id', async (req, res) => {
  try {
    const hunter = await Hunter.findByIdAndDelete(req.params.id);
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Borrar por nombre
router.delete('/search', async (req, res) => {
  try {
    const nombre = typeof req.query.nombre === 'string';
    if(!nombre) {
      res.status(400).send({ error: 'Falta el nombre' });
    }

    const hunter = await Hunter.findOneAndDelete({ nombre });
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.all('/{*splat}', (_, res) => {
  res.status(501).send();
});


export default router;