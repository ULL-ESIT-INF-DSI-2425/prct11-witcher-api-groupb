import express from "express";
import Transaccion from "../models/TransaccionModel.js";
import Hunter from "../models/HuntersModel.js";
import Merchant from "../models/MerchantModel.js";
import Bien from "../models/BienModel.js";

const router = express.Router();

// Crear transacción
router.post("/transactions", async (req, res) => {
  const { nombrePersona, tipoPersona, bienes, devolucion = false } = req.body;

  try {
    let persona;
    let tipoModelo;

    if (tipoPersona === "Hunter") {
      persona = await Hunter.findOne({ nombre: nombrePersona });
      tipoModelo = "HuntersModel";
    } else {
      persona = await Merchant.findOne({ nombre: nombrePersona });
      tipoModelo = "MerchantsModel";
    }

    if (!persona) {
      res.status(404).send({ error: "${tipoPersona} no encontrado" });
      return;
    }

    const bien = await Bien.findOne({ nombre: bienes.nombre });

    if (!bien) {
      res.status(404).send({ error: "Bien no encontrado" });
      return;
    }

    if (tipoPersona === "Hunter" && bien.stock < bienes.cantidad) {
      res.status(400).send({ error: "Stock insuficiente" });
    }

    const dinero = bien.precio * bienes.cantidad;

    if (tipoPersona === "Hunter") {
      bien.stock -= bienes.cantidad;
    } else {
      bien.stock += bienes.cantidad;
    }
    await bien.save();

    const transaccion = new Transaccion({
      persona: persona._id,
      tipoPersona: tipoModelo,
      bienes: {
        bien: bien._id,
        cantidad: bienes.cantidad,
      },
      devolucion,
      dinero,
    });

    await transaccion.save();
    res.status(201).send(transaccion);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener transacciones
router.get("/transactions", async (req, res) => {
  const { _id, nombre, tipoPersona } = req.query;
  let filter = {};

  try {
    if (_id) {
      filter = { _id };
    } else if (nombre && tipoPersona) {
      let persona;
      let tipoModelo;

      if (tipoPersona === "Hunter") {
        persona = await Hunter.findOne({ nombre: nombre.toString() });
        tipoModelo = "HuntersModel";
      } else {
        persona = await Merchant.findOne({ nombre: nombre.toString() });
        tipoModelo = "MerchantsModel";
      }

      if (!persona) {
        res.status(404).send({ error: "Persona no encontrada" });
        return;
      }

      filter = {
        persona: persona._id,
        tipoPersona: tipoModelo,
      };
    }

    const transacciones =
      await Transaccion.find(filter).populate("bienes.bien");

    if (!transacciones.length) {
      res.status(404).send({ error: "No hay transacciones" });
      return;
    }

    res.send(transacciones);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Modificar transacción
router.patch("/transactions", async (req, res) => {
  const { _id, nuevaCantidad } = req.body;

  if (!_id || !nuevaCantidad) {
    res.status(400).send({ error: "Faltan campos" });
    return;
  }

  try {
    const transaccion = await Transaccion.findById(_id).populate("bienes.bien");

    if (!transaccion) {
      res.status(404).send({ error: "Transacción no encontrada" });
      return;
    }

    const bien = await Bien.findById(transaccion.bienes.bien._id);
    if (!bien) {
      res.status(404).send({ error: "Bien no encontrado" });
      return;
    }

    const diferencia = nuevaCantidad - transaccion.bienes.cantidad;

    if (transaccion.tipoPersona === "HuntersModel") {
      if (bien.stock < diferencia) {
        res.status(400).send({ error: "Stock insuficiente" });
        return;
      }
      bien.stock -= diferencia;
    } else {
      bien.stock += diferencia;
    }

    await bien.save();

    transaccion.bienes.cantidad = nuevaCantidad;
    transaccion.dinero = bien.precio * nuevaCantidad;
    await transaccion.save();

    res.send(transaccion);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Borrar transacción
router.delete("/transactions", async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    res.status(400).send({ error: "Falta el ID de la transacción" });
    return;
  }

  try {
    const transaccion = await Transaccion.findById(_id).populate("bienes.bien");
    if (!transaccion) {
      res.status(404).send({ error: "Transacción no encontrada" });
      return;
    }

    const bien = await Bien.findById(transaccion.bienes.bien._id);
    if (!bien) {
      res.status(404).send({ error: "Bien no encontrado" });
      return;
    }

    if (transaccion.tipoPersona === "HuntersModel") {
      bien.stock += transaccion.bienes.cantidad;
    } else {
      bien.stock -= transaccion.bienes.cantidad;
    }

    await bien.save();
    await transaccion.deleteOne();

    res.send({ mensaje: "Transacción eliminada y stock actualizado" });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
