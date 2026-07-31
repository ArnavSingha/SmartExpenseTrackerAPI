import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { JsonExpenseRepository } from '../../src/repositories/json-expense.repository';
import { Expense } from '../../src/models/expense.model';

describe('JsonExpenseRepository (Persistence & Concurrency Assurance)', () => {
  const tempDir = path.resolve(__dirname, '../../data/test-repo');
  const testFilePath = path.join(tempDir, `test-storage-${crypto.randomUUID()}.json`);
  let repository: JsonExpenseRepository;

  beforeEach(async () => {
    repository = new JsonExpenseRepository(testFilePath);
    await repository.clear();
  });

  afterAll(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore errors on teardown
    }
  });

  it('gracefully initializes an empty array when reading a non-existent storage file', async () => {
    const missingPath = path.join(tempDir, `missing-${crypto.randomUUID()}.json`);
    const newRepo = new JsonExpenseRepository(missingPath);

    const data = await newRepo.findAll();
    expect(data).toEqual([]);
  });

  it('atomically saves and retrieves expense entities from local JSON disk', async () => {
    const sample: Expense = {
      id: crypto.randomUUID(),
      title: 'Server Hardware Upgrade',
      amount: 499.99,
      category: 'Infrastructure',
      date: '2026-07-31',
    };

    await repository.save(sample);

    const all = await repository.findAll();
    expect(all).toHaveLength(1);
    expect(all[0]).toEqual(sample);

    // Verify actual file exists and contains properly formatted JSON
    const rawDiskContent = await fs.readFile(testFilePath, 'utf-8');
    const parsed = JSON.parse(rawDiskContent);
    expect(parsed[0].title).toBe('Server Hardware Upgrade');
  });

  it('prevents file corruption under heavy concurrent write operations via mutex sequential write lock', async () => {
    const CONCURRENT_TASKS = 20;
    const tasks: Promise<Expense>[] = [];

    for (let i = 0; i < CONCURRENT_TASKS; i++) {
      const expense: Expense = {
        id: `concurrent-${i}`,
        title: `Task #${i}`,
        amount: i * 10,
        category: 'StressTest',
        date: '2026-07-31',
      };
      tasks.push(repository.save(expense));
    }

    // Run all 20 writes simultaneously
    await Promise.all(tasks);

    const finalRecords = await repository.findAll();
    expect(finalRecords).toHaveLength(CONCURRENT_TASKS);

    // Verify all IDs are intact without race condition overwrites
    const storedIds = finalRecords.map((r) => r.id).sort();
    const expectedIds = Array.from(
      { length: CONCURRENT_TASKS },
      (_, idx) => `concurrent-${idx}`,
    ).sort();
    expect(storedIds).toEqual(expectedIds);
  });

  it('removes target record and returns true, or returns false if UUID is missing', async () => {
    const item1: Expense = {
      id: 'id-1',
      title: 'A',
      amount: 10,
      category: 'X',
      date: '2026-07-31',
    };
    const item2: Expense = {
      id: 'id-2',
      title: 'B',
      amount: 20,
      category: 'Y',
      date: '2026-07-31',
    };
    await repository.save(item1);
    await repository.save(item2);

    const success = await repository.delete('id-1');
    expect(success).toBe(true);

    const remaining = await repository.findAll();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('id-2');

    const failure = await repository.delete('non-existent-id');
    expect(failure).toBe(false);
  });
});
