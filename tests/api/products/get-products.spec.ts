import { test, expect, PRODUCT_DATA, type SelectCaseOptions } from '../../fixtures';
import { expectOkJsonResponse } from '../../../api-assertions';
import { ProductsListResponseSchema } from '../../../src/api/schemas/product.schema';

test.describe('Products | GET /products', { tag: ['@api'] }, () => {
  test.describe('pagination behavior', { tag: ['@functional'] }, () => {
    test(
      'default pagination: returns expected number of items with no params',
      { tag: ['@smoke'] },
      async ({ products }) => {
      const res = await products.getProducts();

      expectOkJsonResponse(res);
      const parsedResponse = ProductsListResponseSchema.parse(res.body);

      expect(parsedResponse.limit).toBe(PRODUCT_DATA.PAGINATION.DEFAULT_LIMIT);
      expect(parsedResponse.skip, 'skip').toBe(PRODUCT_DATA.PAGINATION.DEFAULT_SKIP);
      expect(parsedResponse.total, 'total').toBeGreaterThanOrEqual(0);

        expect(parsedResponse.products, 'products length').toHaveLength(
          Math.min(parsedResponse.total, parsedResponse.limit),
        );
      },
    );

    const paginationCases: [string, { limit: number; skip: number }][] = [
      ['minimal page size', { limit: 1, skip: 0 }],
      ['offset page', { limit: 5, skip: 5 }],
    ];

    for (const [name, params] of paginationCases) {
      test(`${name}: returns correct pagination metadata`, async ({ products }) => {
        const res = await products.getProducts(params);

        expectOkJsonResponse(res);

        const productsResponse = res.body;

        expect(productsResponse.limit, 'limit').toBe(params.limit);
        expect(productsResponse.skip, 'skip').toBe(params.skip);
        expect(productsResponse.total, 'total').toBeGreaterThanOrEqual(0);

        expect(productsResponse.products.length, 'products length').toBeLessThanOrEqual(
          params.limit,
        );

        const [product] = productsResponse.products;
        expect(product.id, 'product.id').toBeGreaterThan(0);
      });
    }

    test('skip at end: returns empty products array when skip equals total', async ({
      products,
    }) => {
      const firstRes = await products.getProducts({ limit: 1 });
      expectOkJsonResponse(firstRes);

      const total = firstRes.body.total;

      const res = await products.getProducts({ limit: 5, skip: total });

      expectOkJsonResponse(res);

      const productsResponse = res.body;

      expect(productsResponse.skip, 'skip').toBe(total);
      expect(productsResponse.products, 'products length').toHaveLength(0);
    });

    test('limit=0: returns all products', async ({ products }) => {
      const res = await products.getProducts({ limit: 0, skip: 0 });

      expectOkJsonResponse(res);

      const productsResponse = res.body;

      expect(productsResponse.total, 'total').toBeGreaterThanOrEqual(0);
      expect(productsResponse.skip, 'skip').toBe(0);

      expect(productsResponse.products, 'products length').toHaveLength(productsResponse.total);
      expect([0, productsResponse.total]).toContain(productsResponse.limit);
    });

    test('near end: returns remaining items when limit exceeds remaining', async ({ products }) => {
      const firstRes = await products.getProducts({ limit: 1, skip: 0 });
      expectOkJsonResponse(firstRes);

      const total = firstRes.body.total;
      const skip = Math.max(total - 2, 0);

      const res = await products.getProducts({ limit: 10, skip: skip });

      expectOkJsonResponse(res);

      const productsResponse = res.body;
      const remaining = total - skip;

      expect(productsResponse.skip, 'skip').toBe(skip);
      expect(productsResponse.products, 'products').toBeInstanceOf(Array);
      expect(productsResponse.products.length, 'products length').toBe(remaining);
      expect(productsResponse.products.length, 'products length <= 10').toBeLessThanOrEqual(10);
    });

    test('pagination: pages do not overlap by ids', async ({ products }) => {
      const resFirstPage = await products.getProducts({ limit: 10, skip: 0 });
      const resSecondPage = await products.getProducts({ limit: 10, skip: 10 });

      expectOkJsonResponse(resFirstPage);
      expectOkJsonResponse(resSecondPage);

      const ids1 = resFirstPage.body.products.map((p) => p.id);
      const ids2 = resSecondPage.body.products.map((p) => p.id);

      const overlap = ids1.filter((id) => ids2.includes(id));
      expect(overlap, 'overlapping ids').toHaveLength(0);
    });
  });

  test.describe('selection of specific data', { tag: ['@functional'] }, () => {
    const selectionCases: [string, SelectCaseOptions][] = [
      ['price and title first page', PRODUCT_DATA.SELECTION_SCENARIOS.titleAndPriceFirstPage()],
      ['price and title offset page', PRODUCT_DATA.SELECTION_SCENARIOS.titleAndPriceFirstPage()],
      ['id only', PRODUCT_DATA.SELECTION_SCENARIOS.idOnly()],
    ];
    for (const [name, params] of selectionCases) {
      test(`select: returns products' field(s) ${name}`, async ({ products }) => {
        const res = await products.getProducts({
          limit: params.limit,
          skip: params.skip,
          select: params.select,
        });
        expectOkJsonResponse(res);

        const productsResponse = res.body;
        expect(productsResponse.products.length, 'products length').toBeLessThanOrEqual(
          params.limit,
        );

        for (const p of productsResponse.products) {
          expect(Object.keys(p).sort(), 'returned product keys').toEqual(
            [...params.expected].sort(),
          );
        }
      });
    }

    test('select: invalid field is ignored safely', { tag: ['@negative'] }, async ({ products }) => {
      const res = await products.getProducts({ limit: 5, skip: 0, select: 'doesNotExist' });

      expectOkJsonResponse(res);
      expect(res.body.products, 'products').toBeInstanceOf(Array);
      expect(res.body.products.length, 'products length').toBeGreaterThan(0);

      const firstProduct = res.body.products[0];
      expect(firstProduct, 'invalid field should not exist in keys').not.toHaveProperty(
        'doesNotExist',
      );

      expect(firstProduct, 'first product id').toHaveProperty('id');
    });

    test(
      'select=title,doesNotExist still returns title for products',
      { tag: ['@negative'] },
      async ({ products }) => {
        const res = await products.getProducts({
          limit: 5,
          skip: 0,
          select: 'title,doesNotExist',
        });
      expect(res.status, 'status not 5xx').toBeLessThan(500);

      expectOkJsonResponse(res);
      expect(res.body.products, 'products').toBeInstanceOf(Array);

        for (const p of res.body.products) {
          expect(p, 'invalid field should not exist in keys').not.toHaveProperty('doesNotExist');
          expect(p, 'product title exists').toHaveProperty('id');
        }
      },
    );
  });

  test.describe('sorting behavior', { tag: ['@functional'] }, () => {
    test('sortBy=title&order=asc returns titles in ascending order', async ({ products }) => {
      test.fixme(true, 'Known DummyJSON issue: descending sort is inconsistent');

      const sortBy = 'title';
      const order = 'asc';
      const res = await products.getProducts({ sortBy, order });

      expectOkJsonResponse(res);
      const productsResponse = ProductsListResponseSchema.parse(res.body);

      expect(productsResponse.products, 'products').toBeInstanceOf(Array);
      expect(productsResponse.products, 'products length').toHaveLength(
        Math.min(productsResponse.total, 30),
      );

      for (let i = 1; i < productsResponse.products.length; i++) {
        const prev = String(productsResponse.products[i - 1].title ?? '');
        const curr = String(productsResponse.products[i].title ?? '');

        console.log(prev, curr);
        expect(
          prev.localeCompare(curr),
          `sorting violation order: ${order} at index ${i}: prev="${prev}", curr="${curr}"`,
        ).toBeLessThanOrEqual(0);
      }
    });
  });
});
