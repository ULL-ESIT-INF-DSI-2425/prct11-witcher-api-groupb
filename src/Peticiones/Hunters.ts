import express from 'express';
import Hunter from '../Modelos/HuntersModel.js';

const router = express.Router();

// Crear
router.post('/', async (req, res) => {
  const hunter = new Hunter(req.body);

  try {
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

// Obtener
router.get('/', async (req, res) => {

  let filter;
  if (req.query.nombre) {
    filter = { nombre: req.query.nombre.toString() };
  } else if (req.query._id) {
    filter = { _id: req.query._id };
  }
  else {
    filter = {};
  }

  try {
    const hunters = await Hunter.find(filter);

    if (hunters.length !== 0) {
      res.send(hunters);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


// Modificar
router.patch('/', async (req, res) => {
  const filter = req.body.nombre ? { nombre: req.body.nombre.toString() } : { _id: req.body._id };
  if(!filter) {
    res.status(400).send({ error: 'Falta el nombre o id' });
  }

  try {
    const hunter = await Hunter.findOneAndUpdate({ filter }, req.body, { new: true, runValidators: true });
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});


// Borrar
router.delete('/', async (req, res) => {
  const filter = req.body.nombre ? { nombre: req.body.nombre.toString() } : { _id: req.body._id };
  if(!filter) {
    res.status(400).send({ error: 'Falta el nombre o id' });
 }

  try {

    const hunter = await Hunter.findOneAndDelete({ filter });
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