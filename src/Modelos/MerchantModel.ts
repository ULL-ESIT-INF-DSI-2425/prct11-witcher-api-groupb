import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Merchant = mongoose.model('Merchant', merchantSchema);
export default Merchant;
