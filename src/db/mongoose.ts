import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL!)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

