import { test, expect } from '../../fixtures/api.fixture';
import { expectOkJsonResponse } from '../../../api-assertions';
import { ProductsListResponseSchema } from '../../../src/api/schemas/product.schema';

test.describe('@api Products | GET /products', () => {
  test.describe('pagination behavior', () => {
    test('default pagination: returns 30 items with no params', async ({ products }) => {
      const res = await products.getProducts();

      expectOkJsonResponse(res);
      const parsedResponse = ProductsListResponseSchema.parse(res.body);

      expect(parsedResponse.limit).toBe(30);
      expect(parsedResponse.skip, 'skip').toBe(0);
      expect(parsedResponse.total, 'total').toBeGreaterThanOrEqual(0);

      expect(parsedResponse.products, 'products').toBeInstanceOf(Array);
      expect(parsedResponse.products, 'products length').toHaveLength(
        Math.min(parsedResponse.total, 30),
      );

      const [product] = parsedResponse.products;
      expect(product.id, 'product.id').toBeGreaterThan(0);
    });
  });
});
