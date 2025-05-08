import express from "express";
import Hunter from "../models/HuntersModel.js";
import Transaccion from "../models/TransaccionModel.js";

const router = express.Router();

// Crear
router.post("/hunters", async (req, res) => {
  const hunter = new Hunter(req.body);

  try {
    await hunter.save();
    res.send(hunter);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener
router.get("/hunters", async (req, res) => {
  let filter;
  if (req.query.nombre) {
    filter = { nombre: req.query.nombre.toString() };
  } else if (req.query._id) {
    filter = { _id: req.query._id };
  } else {
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
router.patch("/hunters", async (req, res) => {
  const filter = req.body.nombre
    ? { nombre: req.body.nombre.toString() }
    : { _id: req.body._id };
  if (!filter) {
    res.status(400).send({ error: "Falta el nombre o id" });
  }

  try {
    const hunter = await Hunter.findOneAndUpdate({ filter }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hunter) {
      res.status(404).send({ error: "No encontrado" });
    }

    res.send(hunter);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Borrar
router.delete("/hunters", async (req, res) => {
  const filter = req.body.nombre
    ? { nombre: req.body.nombre.toString() }
    : { _id: req.body._id };
  if (!filter) {
    res.status(400).send({ error: "Falta el nombre o id" });
  }

  try {
    const hunter = await Hunter.findOne(filter);
    if (!hunter) {
      res.status(404).send({ error: "No encontrado" });
      return;
    }

    await Transaccion.updateMany(
      { persona: hunter._id, tipoPersona: "HuntersModel" },
      {
        $set: {
          persona: "UsuarioEliminado",
          tipoPersona: "UsuarioEliminado",
        },
      },
    );

    await hunter.deleteOne();

    res.send({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
