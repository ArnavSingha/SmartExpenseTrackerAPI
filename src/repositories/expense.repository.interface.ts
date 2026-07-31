import { Expense } from '../models/expense.model';

/**
 * IExpenseRepository Interface
 * Decouples domain business services from direct filesystem or database specifics.
 * Enables dependency injection and frictionless in-memory or filesystem testing.
 */
export interface IExpenseRepository {
  /**
   * Retrieves all expenses, optionally filtering by case-insensitive category name.
   */
  findAll(category?: string): Promise<Expense[]>;

  /**
   * Finds an expense by its universally unique identifier.
   */
  findById(id: string): Promise<Expense | null>;

  /**
   * Persists a newly constructed expense entity.
   */
  save(expense: Expense): Promise<Expense>;

  /**
   * Deletes an expense entity by id. Returns true if deleted, false if not found.
   */
  delete(id: string): Promise<boolean>;

  /**
   * Purges all stored expenses. Primarily utilized for test teardown and reset routines.
   */
  clear(): Promise<void>;

  /**
   * Returns the absolute filesystem storage path or connection identifier.
   */
  getStoragePath(): string;
}
