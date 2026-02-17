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

export function expectValuesToContain(data: unknown[], query: string) {
  const deepSearch = (val: unknown, pattern: string): boolean => {
    if (val === null || val === undefined) return false;
    const target = pattern.toLowerCase();

    switch (typeof val) {
      case 'string':
        return val.toLowerCase().includes(target);
      case 'number':
      case 'boolean':
        return String(val).toLowerCase().includes(target);
      case 'object':
        return Object.values(val).some((child) => deepSearch(child, pattern));
      default:
        return false;
    }
  };

  data.forEach((product, index) => {
    const isFound = deepSearch(product, query);
    expect(
      isFound,
      `search failed: '${query}' was not found in any data values of '${index}' product`,
    ).toBe(true);
  });
}
