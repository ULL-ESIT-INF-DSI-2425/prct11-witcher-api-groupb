import mongoose from 'mongoose';

const hunterSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} no es un número entero'
    }
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  raza: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Hunter = mongoose.model('Hunter', hunterSchema);

export default Hunter;
