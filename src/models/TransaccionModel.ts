import mongoose from "mongoose";
import elementoAlmacenSchema from "./ElementoAlmacenModel.js";

const transaccionSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} no es un número entero",
      },
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    bienes: {
      type: elementoAlmacenSchema,
      required: true,
    },
    persona: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "tipoPersona",
      required: true,
      default: null,
    },
    tipoPersona: {
      type: String,
      required: true,
      enum: ["HuntersModel", "MerchantsModel"],
    },
    devolucion: {
      type: Boolean,
      default: false,
    },
    dinero: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Transaccion = mongoose.model("Transaccion", transaccionSchema);
export default Transaccion;
