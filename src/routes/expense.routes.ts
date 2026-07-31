import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { validate } from '../middlewares/validate.middleware';
import { createExpenseSchema, filterExpensesSchema } from '../schemas/expense.schema';

/**
 * Creates and equips the Express REST router for expense operations.
 * Enforces explicit routing order to prevent dynamic parameter shadowing.
 */
export const createExpenseRouter = (controller: ExpenseController): Router => {
  const router = Router();

  /**
   * POST /api/expenses - Add Expense
   */
  router.post('/', validate({ body: createExpenseSchema }), controller.create);

  /**
   * GET /api/expenses/summary - Calculate Total Expenses & Category Breakdown
   * CRITICAL: Mounted before '/:id' or dynamic routes to prevent shadowing.
   */
  router.get('/summary', controller.summary);

  /**
   * GET /api/expenses - List Expenses & Filter by Category
   */
  router.get('/', validate({ query: filterExpensesSchema }), controller.list);

  /**
   * DELETE /api/expenses/:id - Delete Expense by ID
   */
  router.delete('/:id', controller.delete);

  return router;
};
