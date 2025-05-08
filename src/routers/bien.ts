import express from "express";
import Bien from "../models/BienModel.js";

const router = express.Router();

// Crear bien
router.post('/bienes', async (req, res) => {
  try {
    const bien = new Bien(req.body);
    await bien.save();
    res.status(201).send(bien);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).send({ error: 'ID duplicado' });
    } else if (error.name === 'ValidationError') {
      res.status(400).send(error);
    } else {
      res.status(500).send(error);
    }
  }  
});


// Obtener bien-bienes
router.get("/bienes", async (req, res) => {
  let filter = {};

  if (req.query.nombre) {
    filter = { nombre: req.query.nombre.toString() };
  } else if (req.query._id) {
    filter = { _id: req.query._id };
  }

  try {
    const bienes = await Bien.find(filter);
    if (!bienes.length) {
      res.status(404).send({ error: "No se encontraron bienes" });
    }
    res.send(bienes);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Modificar bien
router.patch("/bienes", async (req, res) => {
  const filter = req.body.nombre
    ? { nombre: req.body.nombre.toString() }
    : { _id: req.body._id };

  if (!filter) {
    res.status(400).send({ error: "Falta el nombre o id del bien" });
  }

  try {
    const bien = await Bien.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bien) {
      res.status(404).send({ error: "Bien no encontrado" });
    }

    res.send(bien);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Borrar bien
router.delete("/bienes", async (req, res) => {
  const filter = req.body.nombre
    ? { nombre: req.body.nombre.toString() }
    : { _id: req.body._id };

  if (!filter) {
    res.status(400).send({ error: "Falta el nombre o id del bien" });
  }

  try {
    const bien = await Bien.findOneAndDelete(filter);

    if (!bien) {
      res.status(404).send({ error: "Bien no encontrado" });
    }

    res.send({ mensaje: "Bien eliminado correctamente" });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
