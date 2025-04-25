import mongoose from 'mongoose';
import elementoAlmacenSchema from './ElementoAlmacenModel.js';

const transaccionSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  bienes: {
    type: elementoAlmacenSchema,
    required: true
  },
  persona: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'tipoPersona',
    required: true
  },
  tipoPersona: {
    type: String,
    required: true,
    enum: ['Hunter', 'Merchant']
  },
  devolucion: {
    type: Boolean,
    default: false
  },
  dinero: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

const Transaccion = mongoose.model('Transaccion', transaccionSchema);
export default Transaccion;
