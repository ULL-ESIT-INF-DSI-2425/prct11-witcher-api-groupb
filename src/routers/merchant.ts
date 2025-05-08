import express from "express";
import Merchant from "../models/MerchantModel.js";
import Transaccion from "../models/TransaccionModel.js";

const router = express.Router();

// Crear
router.post("/merchants", async (req, res) => {
  const merchant = new Merchant(req.body);

  try {
    await merchant.save();
    res.send(merchant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener
router.get("/merchants", async (req, res) => {
  let filter;
  if (req.query.nombre) {
    filter = { nombre: req.query.nombre.toString() };
  } else if (req.query._id) {
    filter = { _id: req.query._id };
  } else {
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
router.patch("/merchants", async (req, res) => {
  const filter = req.body.nombre
    ? { nombre: req.body.nombre.toString() }
    : { _id: req.body._id };
  if (!filter) {
    res.status(400).send({ error: "Falta el nombre o id" });
  }

  try {
    const merchant = await Merchant.findOneAndUpdate({ filter }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!merchant) {
      res.status(404).send({ error: "No encontrado" });
    }

    res.send(merchant);
  } catch (error) {
    res.status(500).send({ error });
  }
});

// Borrar
router.delete("/merchants", async (req, res) => {
  const filter = req.body.nombre
    ? { nombre: req.body.nombre.toString() }
    : { _id: req.body._id };
  if (!filter) {
    res.status(400).send({ error: "Falta el nombre o id" });
  }

  try {
    const merchant = await Merchant.findOne(filter);
    if (!merchant) {
      res.status(404).send({ error: "No encontrado" });
      return;
    }

    await Transaccion.updateMany(
      { persona: merchant._id, tipoPersona: "MerchantsModel" },
      {
        $set: {
          persona: "UsuarioEliminado",
          tipoPersona: "UsuarioEliminado",
        },
      },
    );

    await merchant.deleteOne();

    res.send({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default router;
