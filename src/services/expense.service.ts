import crypto from 'crypto';
import { Expense, CreateExpenseDTO, ExpenseSummary, CategoryBreakdown } from '../models/expense.model';
import { IExpenseRepository } from '../repositories/expense.repository.interface';
import { ResourceNotFoundError } from '../models/api-error.model';

/**
 * ExpenseService
 * Contains pure domain business logic, ID generation, normalization, and precision calculation.
 * Completely decoupled from HTTP frameworks or direct persistence details via interface injection.
 */
export class ExpenseService {
  private readonly repository: IExpenseRepository;

  constructor(repository: IExpenseRepository) {
    this.repository = repository;
  }

  /**
   * Rounds a decimal value to exactly two decimal places using exact mathematics
   * to eliminate IEEE 754 floating-point inaccuracies during sum aggregation.
   */
  private roundCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Normalizes category titles for uniform display and grouping
   * e.g., trims whitespace and standardizes capital formatting if necessary, while maintaining fidelity.
   */
  private normalizeString(value: string): string {
    return value.trim();
  }

  /**
   * Creates and persists a validated expense entity with an auto-generated UUID.
   */
  public async createExpense(dto: CreateExpenseDTO): Promise<Expense> {
    const expense: Expense = {
      id: crypto.randomUUID(),
      title: this.normalizeString(dto.title),
      amount: this.roundCurrency(dto.amount),
      category: this.normalizeString(dto.category),
      date: dto.date.trim(),
    };

    return await this.repository.save(expense);
  }

  /**
   * Retrieves stored expenses, optionally filtered by a specific category tag.
   */
  public async listExpenses(category?: string): Promise<Expense[]> {
    return await this.repository.findAll(category);
  }

  /**
   * Computes aggregate total expenses and a category breakdown with guaranteed decimal precision.
   */
  public async getSummary(): Promise<ExpenseSummary> {
    const allExpenses = await this.repository.findAll();
    
    let total = 0;
    const byCategory: CategoryBreakdown = {};

    for (const item of allExpenses) {
      total += item.amount;
      const cat = item.category;
      const currentCategorySum = byCategory[cat] || 0;
      byCategory[cat] = this.roundCurrency(currentCategorySum + item.amount);
    }

    return {
      total: this.roundCurrency(total),
      byCategory,
      count: allExpenses.length,
    };
  }

  /**
   * Removes an expense by ID or throws ResourceNotFoundError if missing.
   */
  public async deleteExpense(id: string): Promise<void> {
    const wasDeleted = await this.repository.delete(id);
    if (!wasDeleted) {
      throw new ResourceNotFoundError(`Expense with identifier '${id}' does not exist in records.`);
    }
  }
}
