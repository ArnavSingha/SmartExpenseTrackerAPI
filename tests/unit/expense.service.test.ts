import { describe, it, expect, beforeEach } from 'vitest';
import { ExpenseService } from '../../src/services/expense.service';
import { IExpenseRepository } from '../../src/repositories/expense.repository.interface';
import { Expense, CreateExpenseDTO } from '../../src/models/expense.model';
import { ResourceNotFoundError } from '../../src/models/api-error.model';

/**
 * In-Memory Mock Repository
 * Allows pure unit testing of ExpenseService domain logic without touching the filesystem.
 */
class MockExpenseRepository implements IExpenseRepository {
  private store: Expense[] = [];

  public async findAll(category?: string): Promise<Expense[]> {
    if (!category) return this.store;
    return this.store.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }

  public async findById(id: string): Promise<Expense | null> {
    return this.store.find((e) => e.id === id) || null;
  }

  public async save(expense: Expense): Promise<Expense> {
    this.store.push(expense);
    return expense;
  }

  public async delete(id: string): Promise<boolean> {
    const idx = this.store.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.store.splice(idx, 1);
    return true;
  }

  public async clear(): Promise<void> {
    this.store = [];
  }

  public getStoragePath(): string {
    return 'memory://mock-repository';
  }
}

describe('ExpenseService (Pure Domain Business Logic)', () => {
  let repository: IExpenseRepository;
  let service: ExpenseService;

  beforeEach(async () => {
    repository = new MockExpenseRepository();
    service = new ExpenseService(repository);
    await repository.clear();
  });

  it('creates an expense with a generated UUID and normalized trimmed fields', async () => {
    const dto: CreateExpenseDTO = {
      title: '   Client Coffee Meeting   ',
      amount: 15.50,
      category: '  Meals  ',
      date: ' 2026-07-31 ',
    };

    const created = await service.createExpense(dto);

    expect(created.id).toBeDefined();
    expect(typeof created.id).toBe('string');
    expect(created.title).toBe('Client Coffee Meeting');
    expect(created.category).toBe('Meals');
    expect(created.date).toBe('2026-07-31');
    expect(created.amount).toBe(15.50);
  });

  it('rounds amounts to exactly two decimal places to prevent IEEE 754 precision drift', async () => {
    const dto1: CreateExpenseDTO = { title: 'Item 1', amount: 10.104, category: 'Tech', date: '2026-07-31' };
    const dto2: CreateExpenseDTO = { title: 'Item 2', amount: 20.206, category: 'Tech', date: '2026-07-31' };

    await service.createExpense(dto1);
    await service.createExpense(dto2);

    const summary = await service.getSummary();
    // 10.10 + 20.21 = 30.31
    expect(summary.total).toBe(30.31);
    expect(summary.byCategory['Tech']).toBe(30.31);
    expect(summary.count).toBe(2);
  });

  it('filters listed expenses by case-insensitive category tags', async () => {
    await service.createExpense({ title: 'Lunch', amount: 20, category: 'Food', date: '2026-07-31' });
    await service.createExpense({ title: 'Taxi', amount: 45, category: 'Travel', date: '2026-07-31' });
    await service.createExpense({ title: 'Dinner', amount: 60, category: 'food', date: '2026-07-31' });

    const foodExpenses = await service.listExpenses('FOOD');
    const travelExpenses = await service.listExpenses('Travel');

    expect(foodExpenses).toHaveLength(2);
    expect(travelExpenses).toHaveLength(1);
  });

  it('computes accurate zero summary metrics when records are empty', async () => {
    const summary = await service.getSummary();
    expect(summary.total).toBe(0);
    expect(summary.count).toBe(0);
    expect(Object.keys(summary.byCategory)).toHaveLength(0);
  });

  it('deletes an existing expense record successfully', async () => {
    const item = await service.createExpense({ title: 'To Delete', amount: 9.99, category: 'Misc', date: '2026-07-31' });
    
    await expect(service.deleteExpense(item.id)).resolves.toBeUndefined();

    const list = await service.listExpenses();
    expect(list).toHaveLength(0);
  });

  it('throws ResourceNotFoundError when deleting a non-existent UUID', async () => {
    await expect(service.deleteExpense('00000000-0000-0000-0000-000000000000'))
      .rejects.toThrow(ResourceNotFoundError);
  });
});
