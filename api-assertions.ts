import type { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

export function expectOkJsonResponse(response: {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
}) {
  expect(response.status, 'status').toBe(200);
  expect(response.headers['content-type'] ?? '').toContain('application/json');
}
