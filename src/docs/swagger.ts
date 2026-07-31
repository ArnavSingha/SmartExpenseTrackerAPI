import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import openApiSpec from './openapi.json';

/**
 * Mounts interactive Swagger UI documentation onto the configured router.
 * Serves complete OpenAPI 3.0 specification without requiring external doc generators.
 */
export const createDocsRouter = (): Router => {
  const router = Router();

  const options: swaggerUi.SwaggerUiOptions = {
    customSiteTitle: 'Smart Expense Tracker API - OpenAPI Docs',
    customCss: '.swagger-ui .topbar { background-color: #1a1a1a; }',
  };

  router.use('/', swaggerUi.serve, swaggerUi.setup(openApiSpec, options));

  return router;
};
