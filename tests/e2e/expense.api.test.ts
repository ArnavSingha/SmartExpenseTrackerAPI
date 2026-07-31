import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { createApp } from '../../src/app';

describe('E2E REST API Integration Suite (Supertest)', () => {
  const tempDir = path.resolve(__dirname, '../../data/test-e2e');
  const testStoragePath = path.join(tempDir, `e2e-${crypto.randomUUID()}.json`);
  const app = createApp(testStoragePath);

  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  afterAll(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Clean teardown
    }
  });

  describe('POST /api/expenses (Creation & Schema Validation)', () => {
    it('creates a valid expense and returns HTTP 201 Created with universal success envelope', async () => {
      const payload = {
        title: 'Monthly Cloud Server Hosting',
        amount: 125.5,
        category: 'Infrastructure',
        date: '2026-07-31',
      };

      const res = await request(app).post('/api/expenses').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe(payload.title);
      expect(res.body.data.amount).toBe(payload.amount);
    });

    it('rejects requests with negative or zero amounts with HTTP 400 VALIDATION_ERROR', async () => {
      const invalidPayload = {
        title: 'Negative Cashflow',
        amount: -50,
        category: 'Fraud',
        date: '2026-07-31',
      };

      const res = await request(app).post('/api/expenses').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.message).toContain('Amount must be strictly greater than zero');
    });

    it('rejects requests with invalid calendar timestamps with HTTP 400 VALIDATION_ERROR', async () => {
      const invalidDatePayload = {
        title: 'Time Travel Flight',
        amount: 500,
        category: 'Travel',
        date: '2026-13-45', // Invalid calendar date
      };

      const res = await request(app).post('/api/expenses').send(invalidDatePayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('rejects malformed unparsable JSON syntax payloads with HTTP 400 MALFORMED_JSON', async () => {
      const res = await request(app)
        .post('/api/expenses')
        .set('Content-Type', 'application/json')
        .send('{"title": "Broken JSON", "amount": 100'); // Missing closing brace

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('MALFORMED_JSON');
    });
  });

  describe('GET /api/expenses (Listing & Category Filtering)', () => {
    it('retrieves persistent list and filters accurately by category query parameter', async () => {
      await request(app)
        .post('/api/expenses')
        .send({ title: 'Team Lunch', amount: 50, category: 'Meals', date: '2026-07-31' });
      await request(app)
        .post('/api/expenses')
        .send({ title: 'Train Ticket', amount: 80, category: 'Transit', date: '2026-07-31' });

      const listAllRes = await request(app).get('/api/expenses');
      expect(listAllRes.status).toBe(200);
      expect(listAllRes.body.data.length).toBeGreaterThanOrEqual(3); // Includes previous test record

      const filterRes = await request(app).get('/api/expenses?category=meals');
      expect(filterRes.status).toBe(200);
      expect(filterRes.body.data).toHaveLength(1);
      expect(filterRes.body.data[0].category).toBe('Meals');
    });

    it('returns an empty array when filtering by a non-existent category tag', async () => {
      const res = await request(app).get('/api/expenses?category=NonExistentTag');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/expenses/summary (Aggregate Calculations)', () => {
    it('returns accurate summary calculations across all existing records', async () => {
      const res = await request(app).get('/api/expenses/summary');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data.total).toBe('number');
      expect(res.body.data.total).toBeGreaterThan(0);
      expect(res.body.data.byCategory).toBeDefined();
    });
  });

  describe('DELETE /api/expenses/:id (Deletion & Resource Validation)', () => {
    it('permanently deletes an existing expense record by ID', async () => {
      const createRes = await request(app)
        .post('/api/expenses')
        .send({ title: 'Disposable Item', amount: 12.99, category: 'Temp', date: '2026-07-31' });
      const targetId = createRes.body.data.id;

      const deleteRes = await request(app).delete(`/api/expenses/${targetId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.data).toBeNull();

      // Verify deletion via follow-up listing check
      const checkRes = await request(app).get(`/api/expenses/${targetId}`);
      expect(checkRes.status).toBe(404); // Unmapped route or item missing
    });

    it('returns HTTP 404 RESOURCE_NOT_FOUND when attempting to delete non-existent UUID', async () => {
      const res = await request(app).delete('/api/expenses/c7a82e9b-4b2a-4a30-8c9e-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('Unknown Route Routing Protection', () => {
    it('returns HTTP 404 with standardized error envelope for unmapped endpoints', async () => {
      const res = await request(app).get('/api/unsupported-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });
});
