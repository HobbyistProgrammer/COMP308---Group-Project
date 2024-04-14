import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        'vitals-microservice': 'http://localhost:3002/vitals',
        'user-authentication-microservice': 'http://localhost:3003/auth',
        'motivational-tip-microservice': 'http://localhost:3004/tips',
        'symptom-checker-microservice': 'http://localhost:3007/check-symptoms',  
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
