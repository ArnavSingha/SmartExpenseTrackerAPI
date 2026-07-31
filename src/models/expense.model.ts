/**
 * Core Domain Model for Smart Expense Tracker
 * Represents an individual financial expense item.
 */
export interface Expense {
  /** Secure universally unique identifier (UUID v4) */
  id: string;
  /** Short descriptive title of the expense */
  title: string;
  /** Monetary expense amount (strictly positive finite decimal) */
  amount: number;
  /** Normalized category tag (e.g. 'Food', 'Travel', 'Utilities') */
  category: string;
  /** ISO 8601 UTC timestamp format (YYYY-MM-DD or full ISO string) */
  date: string;
}

/**
 * Data Transfer Object (DTO) for creating a new expense.
 * Omits the server-generated id.
 */
export type CreateExpenseDTO = Omit<Expense, 'id'>;

/**
 * Category calculation breakdown mapping category name to aggregate total.
 */
export interface CategoryBreakdown {
  [category: string]: number;
}

/**
 * Aggregate summary metrics for all stored expenses.
 */
export interface ExpenseSummary {
  /** Overall total of all recorded expenses, rounded to exactly two decimal places */
  total: number;
  /** Aggregate breakdown by normalized category */
  byCategory: CategoryBreakdown;
  /** Total number of recorded expenses in the system */
  count: number;
}
