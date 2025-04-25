import mongoose from 'mongoose';

const hunterSchema = new mongoose.Schema({
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
