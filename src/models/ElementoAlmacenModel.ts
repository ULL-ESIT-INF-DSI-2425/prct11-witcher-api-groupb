import mongoose from "mongoose";

const elementoAlmacenSchema = new mongoose.Schema({
  bien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BienModel",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
});

export default elementoAlmacenSchema;
