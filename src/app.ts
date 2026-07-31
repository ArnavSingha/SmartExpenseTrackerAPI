import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import { JsonExpenseRepository } from './repositories/json-expense.repository';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { createExpenseRouter } from './routes/expense.routes';
import { createDocsRouter } from './docs/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { ResourceNotFoundError } from './models/api-error.model';

/**
 * Express Application Bootstrap Factory
 * Encourages clean dependency inversion and enables isolated E2E Supertest
 * execution by allowing ephemeral test storage file paths to be injected.
 *
 * @param customStoragePath - Optional override for filesystem JSON location during test runs
 */
export const createApp = (customStoragePath?: string): Express => {
  const app = express();

  // Standard Security & Body Parsing Middleware
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Initialize Core Clean Layered Architecture Dependency Tree
  const storagePath = customStoragePath || config.storage.defaultFilePath;
  const repository = new JsonExpenseRepository(storagePath);
  const service = new ExpenseService(repository);
  const controller = new ExpenseController(service);
  const expenseRouter = createExpenseRouter(controller);
  const docsRouter = createDocsRouter();

  // Mount API Endpoints and OpenAPI Documentation
  app.use(`${config.apiPrefix}/expenses`, expenseRouter);
  app.use(config.docsPrefix, docsRouter);

  // Root Health & Information Route
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        name: 'Smart Expense Tracker API',
        status: 'Operational',
        documentation: `${config.docsPrefix}`,
        apiBase: `${config.apiPrefix}/expenses`,
      },
    });
  });

  // Catch-all 404 Interceptor for unmapped route endpoints
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new ResourceNotFoundError(`Cannot execute ${req.method} on unmapped route ${req.path}.`));
  });

  // Centralized Universal Error Formatting Interceptor
  app.use(errorMiddleware);

  return app;
};
