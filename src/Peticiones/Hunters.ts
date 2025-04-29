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

// Obtener por nombre
router.get('/:nombre', async (req, res) => {
  const filter = req.params.nombre
    ? { nombre: req.params.nombre.toString() }
    : {};

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
    const allowedUpdates = Object.keys(Hunter.schema.paths).filter((key) => key !== 'ID');
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) {
      res.status(400).send({
        error: "Update is not permitted",
      });
    } else {
      const hunter = await Hunter.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      )

      if (hunter) {
        res.send(hunter);
      } else {
        res.status(404).send();
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

    /** 
    const hunter = await Hunter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!hunter) {
      res.status(404).send({ error: 'No encontrado' });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});
*/

// Modificar por nombre
router.patch('/:nombre', async (req, res) => {
  try {
    const nombre = typeof req.params.nombre === 'string';
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
router.delete('/:nombre', async (req, res) => {
  try {
    const nombre = typeof req.params.nombre === 'string';
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