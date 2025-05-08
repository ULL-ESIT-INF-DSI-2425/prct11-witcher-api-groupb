import { describe, beforeAll } from 'vitest';
import Hunter from '../src/models/HuntersModel.js';
import Merchant from '../src/models/MerchantModel.js';
import Bien from '../src/models/BienModel.js';
import Transaccion from '../src/models/TransaccionModel.js';

beforeAll(async () => {
  await Promise.all([
    Hunter.deleteMany({}),
    Merchant.deleteMany({}),
    Bien.deleteMany({}),
    Transaccion.deleteMany({})
  ]);
});


describe('Ejecución ordenada de pruebas', async () => {
  await import('./hunter.spec.ts');
  await import('./merchant.spec.ts');
  await import('./bien.spec.ts');
  await import('./transaction.spec.ts');
});
