/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js'],
    globals: true, // Ensure Jest globals are available
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  },
  resolve: {
    alias: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  },
});