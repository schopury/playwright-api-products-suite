import { test, expect, PRODUCT_DATA, type SearchCaseOptions } from '../../fixtures';
import { expectOkJsonResponse, expectValuesToContain } from '../../../api-assertions';
import { ProductsListResponseSchema } from '../../../src/api/schemas/product.schema';

test.describe('Products | SEARCH /products/search', { tag: ['@api'] }, () => {
  const cases: [string, SearchCaseOptions][] = [
    ['Case Insensitive Search', PRODUCT_DATA.SEARCH_SCENARIOS.caseInsensitive()],
    ['Partial String Match', PRODUCT_DATA.SEARCH_SCENARIOS.partialMatch()],
    ['Multi-word Query', PRODUCT_DATA.SEARCH_SCENARIOS.multiWordSearch()],
  ];

  for (const [description, data] of cases) {
    const { query, expected } = data;
    test(`search logic: returns results for ${description}`, { tag: ['@smoke'] }, async ({ products }) => {
      const res = await products.searchProducts({ q: query });

      expectOkJsonResponse(res);
      const parsedResponse = ProductsListResponseSchema.parse(res.body);

      expect(parsedResponse.products, 'products').toBeInstanceOf(Array);
      expectValuesToContain(parsedResponse.products, expected);
    });
  }

  test('search: supports pagination params (limit/skip)', { tag: ['@functional'] }, async ({ products }) => {
    const { query, limit, skip } = PRODUCT_DATA.SEARCH.pagination;
    const res = await products.searchProducts({ q: query, limit, skip });

    expectOkJsonResponse(res);

    expect(res.body.limit, 'limit').toBe(limit);
    expect(res.body.skip, 'skip').toBe(skip);
    expect(res.body.products, 'products').toBeInstanceOf(Array);
    expect(res.body.products.length, 'products length').toBeLessThanOrEqual(limit);
    expect(res.body.total, 'total').toBeGreaterThanOrEqual(0);
  });

  test('search: no results returns empty products array', async ({ products }) => {
    const query = `no_such_product_${Date.now()}`;
    const res = await products.searchProducts({ q: query });

    expectOkJsonResponse(res);

    expect(res.body.products, 'products').toBeInstanceOf(Array);
    expect(res.body.products.length, 'products length').toBe(0);
    expect(res.body.total, 'total').toBe(0);
  });
});
