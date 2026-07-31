import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { CreateExpenseInput, FilterExpensesQuery } from '../schemas/expense.schema';
import { ApiSuccessPayload } from '../models/api-error.model';
import { Expense, ExpenseSummary } from '../models/expense.model';

/**
 * ExpenseController (Ultra-Thin HTTP Binding Layer)
 * Responsible solely for parsing HTTP request parameters, delegating operations
 * to the domain ExpenseService, and binding output to standardized JSON envelopes.
 * Contains zero database, file, or complex domain business logic.
 */
export class ExpenseController {
  private readonly service: ExpenseService;

  constructor(service: ExpenseService) {
    this.service = service;
  }

  /**
   * POST /api/expenses
   * Creates a new financial expense item.
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as CreateExpenseInput;
      const createdExpense = await this.service.createExpense(input);
      
      const response: ApiSuccessPayload<Expense> = {
        success: true,
        data: createdExpense,
      };
      
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/expenses
   * Retrieves a collection of expenses, optionally filtered by ?category=...
   */
  public list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.query as FilterExpensesQuery;
      const expenses = await this.service.listExpenses(category);
      
      const response: ApiSuccessPayload<Expense[]> = {
        success: true,
        data: expenses,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/expenses/summary
   * Computes aggregate expense totals and per-category breakdown.
   */
  public summary = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summaryData = await this.service.getSummary();
      
      const response: ApiSuccessPayload<ExpenseSummary> = {
        success: true,
        data: summaryData,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/expenses/:id
   * Removes a targeted expense record by its unique UUID.
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteExpense(id);
      
      const response: ApiSuccessPayload<null> = {
        success: true,
        data: null,
        message: `Expense ${id} has been permanently deleted.`,
      };
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
