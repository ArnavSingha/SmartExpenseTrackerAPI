import { createApp } from './app';
import { config } from './config';

/**
 * HTTP Server Entry Point & Lifecycle Supervisor
 * Handles server instantiation and graceful process shutdown signals (SIGINT/SIGTERM)
 * to ensure in-flight requests finish cleanly before exit.
 */
const startServer = (): void => {
  const app = createApp();
  const port = config.port;

  const server = app.listen(port, () => {
    /* eslint-disable no-console */
    console.info('====================================================');
    console.info(`🚀 Smart Expense Tracker API running on port ${port}`);
    console.info(
      `📚 OpenAPI Swagger Docs available at: http://localhost:${port}${config.docsPrefix}`,
    );
    console.info(`📦 Persistent JSON Storage: ${config.storage.defaultFilePath}`);
    console.info('====================================================');
    /* eslint-enable no-console */
  });

  const handleGracefulShutdown = (signal: string) => {
    /* eslint-disable no-console */
    console.info(`\n[${signal}] Signal intercepted. Initiating graceful shutdown...`);
    server.close(() => {
      console.info('HTTP Server closed successfully. Exiting process clean.');
      process.exit(0);
    });
    /* eslint-enable no-console */
  };

  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[CRITICAL] Unhandled Promise Rejection intercepted:', reason);
  });
};

startServer();
