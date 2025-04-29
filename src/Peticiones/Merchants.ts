import express from 'express';
import Merchant from '../Modelos/MerchantModel.js';

const router = express.Router();

// Crear
router.post('/', async (req, res) => {
  const merchant = new Merchant(req.body);

  try {
    await merchant.save();
    res.send(merchant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todos
router.get('/', async (_, res) => {
  try {
    const merchant = await Merchant.find();
    res.send(merchant);
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
    const merchant = await Merchant.find(filter);

    if (merchant.length !== 0) {
      res.send(merchant);
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
    const merchant = await Merchant.findOneAndUpdate({ filter }, req.body, { new: true, runValidators: true });
    if(!merchant) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(merchant);
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

    const merchant = await Merchant.findOneAndDelete({ filter });
    if(!merchant) {
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