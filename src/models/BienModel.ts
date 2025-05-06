import mongoose from 'mongoose';

const bienSchema = new mongoose.Schema({
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
  descripcion: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: true
  },
  peso: {
    type: Number,
    required: true,
    min: 0.01
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, { timestamps: true });

const Bien = mongoose.model('Bien', bienSchema);
export default Bien;
