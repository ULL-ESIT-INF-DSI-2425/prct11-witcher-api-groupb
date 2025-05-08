import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/posada-app';

beforeAll(async () => {
  try {
    console.log('Conectando a MongoDB');
    await mongoose.connect(MONGO_URL);
    console.log('Conectado con éxito');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    console.log('Cerrando conexión a MongoDB...');
    await mongoose.connection.dropDatabase(); // opcional
    await mongoose.disconnect();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error cerrando MongoDB:', error);
  }
});

