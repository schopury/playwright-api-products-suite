import { expect } from '@playwright/test';

export function expectOkJsonResponse(response: {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
}) {
  expect(response.status, 'status 2xx').toBeGreaterThanOrEqual(200);
  expect(response.status, 'status < 300').toBeLessThan(300);
  expect(response.headers['content-type'] ?? '').toContain('application/json');
}

export function expectNoServerError(response: { status: number }) {
  expect(response.status, 'should not return 5xx server error').toBeLessThan(500);
}
