import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`✨ GlowNest platform running on port ${env.PORT}`);
  console.log(`🛡️  Analysis Provider Mode: ${env.ANALYSIS_PROVIDER.toUpperCase()}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

