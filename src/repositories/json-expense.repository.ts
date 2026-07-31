import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Expense } from '../models/expense.model';
import { IExpenseRepository } from './expense.repository.interface';
import { InternalServerException } from '../models/api-error.model';

/**
 * JsonExpenseRepository
 * Concrete persistence layer implementing local filesystem JSON storage.
 * 
 * Production Protections:
 * 1. Transactional Operation Mutex Lock: Guarantees that the entire read-modify-write
 *    cycle for concurrent requests executes sequentially, completely eliminating
 *    race conditions where concurrent tasks read stale disk array snapshots.
 * 2. Atomic Filesystem Writes: Writes JSON to a temporary unique UUID file first,
 *    then performs an atomic file replace (rename) to prevent corrupted state if
 *    process terminates mid-write.
 * 3. Graceful Auto-Initialization: Automatically creates destination directories and
 *    defaults to empty JSON array [] if storage file is missing upon startup.
 */
export class JsonExpenseRepository implements IExpenseRepository {
  private readonly filePath: string;
  /** Sequential FIFO promise mutex preventing read-modify-write race conditions */
  private operationLock: Promise<any> = Promise.resolve();

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public getStoragePath(): string {
    return this.filePath;
  }

  /**
   * Executes any persistence read or write operation inside a strict sequential
   * mutex queue to eliminate concurrent IO corruption and snapshot race conditions.
   */
  private async executeWithLock<T>(operation: () => Promise<T>): Promise<T> {
    const nextOperation = this.operationLock.then(() => operation());
    // Catch rejection on lock chain so subsequent queued operations do not permanently deadlock
    this.operationLock = nextOperation.catch(() => {});
    return nextOperation;
  }

  /**
   * Reads and parses stored expenses array from disk.
   */
  private async readFromDisk(): Promise<Expense[]> {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? (parsed as Expense[]) : [];
    } catch (error: any) {
      // If file does not exist yet, initialize cleanly as empty array
      if (error?.code === 'ENOENT') {
        return [];
      }
      throw new InternalServerException(`Corrupt JSON storage or disk read error at ${this.filePath}.`);
    }
  }

  /**
   * Atomically writes expenses array to storage file via temporary file rename.
   */
  private async writeToDisk(expenses: Expense[]): Promise<void> {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      const data = JSON.stringify(expenses, null, 2);
      // Temporary atomic file staging
      const tempPath = `${this.filePath}.tmp.${crypto.randomUUID()}`;
      await fs.writeFile(tempPath, data, 'utf-8');
      // Atomic filesystem rename replaces old file instantly
      await fs.rename(tempPath, this.filePath);
    } catch (error: any) {
      throw new InternalServerException(`Failed to persist expense storage atomically: ${error?.message || 'IO Error'}`);
    }
  }

  public async findAll(category?: string): Promise<Expense[]> {
    return this.executeWithLock(async () => {
      const allExpenses = await this.readFromDisk();
      if (!category) {
        return allExpenses;
      }
      const targetCategory = category.trim().toLowerCase();
      return allExpenses.filter((e) => e.category.toLowerCase() === targetCategory);
    });
  }

  public async findById(id: string): Promise<Expense | null> {
    return this.executeWithLock(async () => {
      const allExpenses = await this.readFromDisk();
      const expense = allExpenses.find((e) => e.id === id);
      return expense || null;
    });
  }

  public async save(expense: Expense): Promise<Expense> {
    return this.executeWithLock(async () => {
      const allExpenses = await this.readFromDisk();
      allExpenses.push(expense);
      await this.writeToDisk(allExpenses);
      return expense;
    });
  }

  public async delete(id: string): Promise<boolean> {
    return this.executeWithLock(async () => {
      const allExpenses = await this.readFromDisk();
      const targetIndex = allExpenses.findIndex((e) => e.id === id);
      if (targetIndex === -1) {
        return false;
      }
      allExpenses.splice(targetIndex, 1);
      await this.writeToDisk(allExpenses);
      return true;
    });
  }

  public async clear(): Promise<void> {
    return this.executeWithLock(async () => {
      await this.writeToDisk([]);
    });
  }
}
