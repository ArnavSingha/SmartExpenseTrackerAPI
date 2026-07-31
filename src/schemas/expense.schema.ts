import { z } from 'zod';

/**
 * ISO 8601 Date regex validation pattern (YYYY-MM-DD or full ISO string)
 */
const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;

/**
 * Zod Schema for creating a new expense (POST /api/expenses)
 * Enforces strict typing, positive numbers, and trimmed non-empty string tags.
 */
export const createExpenseSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required.',
      invalid_type_error: 'Title must be a string.',
    })
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(150, 'Title cannot exceed 150 characters.'),
  amount: z
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.',
    })
    .finite('Amount must be a finite number.')
    .positive('Amount must be strictly greater than zero.')
    .max(1_000_000_000, 'Amount exceeds maximum allowed limit.'),
  category: z
    .string({
      required_error: 'Category is required.',
      invalid_type_error: 'Category must be a string.',
    })
    .trim()
    .min(1, 'Category cannot be empty.')
    .max(50, 'Category cannot exceed 50 characters.'),
  date: z
    .string({
      required_error: 'Date is required.',
      invalid_type_error: 'Date must be a string in ISO format (YYYY-MM-DD).',
    })
    .trim()
    .regex(isoDateRegex, 'Date must be in valid ISO 8601 format (e.g. YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ).')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Date contains an invalid calendar timestamp.',
    }),
});

/**
 * Zod Schema for filtering expenses by category in query string (GET /api/expenses?category=...)
 */
export const filterExpensesSchema = z.object({
  category: z.string().trim().min(1).optional(),
});

/**
 * Type inference exports matching validated input structures.
 */
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type FilterExpensesQuery = z.infer<typeof filterExpensesSchema>;
