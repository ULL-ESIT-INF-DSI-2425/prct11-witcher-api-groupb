import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
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
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Merchant = mongoose.model("Merchant", merchantSchema);
export default Merchant;
