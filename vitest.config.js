import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 30000,
    hookTimeout: 15000,
    setupFilesAfterEnv: ['./tests/setup.ts'],
    environment: 'node',
    coverage: {
      all: false,
      include: ['src/**/*.ts'],
    },
  },
});
