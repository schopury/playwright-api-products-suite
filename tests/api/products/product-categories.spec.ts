import { test, expect, PRODUCT_DATA } from '@fixtures/index';
import { expectOkJsonResponse } from '../../../src/api/assertions/api-assertions';
import {
  ProductsListResponseSchema,
  ProductCategoriesSchema,
  CategoryListSchema,
} from '@/api/schemas/product.schema';

test.describe('Products | Categories', { tag: ['@api'] }, () => {
  test.describe('GET /products/categories', () => {
    test('returns a non-empty array of category strings', async ({ products }) => {
      const res = await products.getProductsCategories();

      expectOkJsonResponse(res);

      expect(res.body, 'categories').toBeInstanceOf(Array);
      expect(res.body.length, 'categories length').toBeGreaterThan(0);

      const parsedCategories = ProductCategoriesSchema.parse(res.body);

      const slugs = parsedCategories.map((c) => c.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    });
  });

  test.describe('GET /products/category-list', () => {
    test('returns list of categories with valid shape', async ({ products }) => {
      const res = await products.getProductsCategoryList();

      expectOkJsonResponse(res);

      const parsedCategories = CategoryListSchema.parse(res.body);

      const unique = new Set(parsedCategories as Array<unknown>);
      expect(unique.size, 'unique categories').toBe((parsedCategories as Array<unknown>).length);
    });

    test('category endpoints should return consistent items with /products/categories', async ({
      products,
    }) => {
      const [resA, resB] = await Promise.all([
        products.getProductsCategories(),
        products.getProductsCategoryList(),
      ]);

      const listA = ProductCategoriesSchema.parse(resA.body).map((c) => c.slug);
      const listB = CategoryListSchema.parse(resB.body);

      expect(listA).toEqual(expect.arrayContaining(listB));
      expect(listB).toEqual(expect.arrayContaining(listA));
    });
  });

  test.describe('GET /products/category/:category', { tag: ['@functional'] }, () => {
    test('base filtering: returns products list of given category', async ({ products }) => {
      const payload = PRODUCT_DATA.CATEGORY_SCENARIOS.baseFilter();
      const res = await products.getProductsByCategory(payload.category);

      expectOkJsonResponse(res);
      const parsedResponse = ProductsListResponseSchema.parse(res.body);

      const categories = parsedResponse.products.map((p) => p.category);
      expect(new Set(categories)).toEqual(new Set([payload.category]));
    });

    test('filtering with pagination: returns products list of given category with pagination', async ({
      products,
    }) => {
      const payload = PRODUCT_DATA.CATEGORY_SCENARIOS.paginatedFilter();
      const res = await products.getProductsByCategory(payload.category, payload.params);

      expectOkJsonResponse(res);
      const productsResponse = res.body;

      expect(productsResponse.limit, 'limit').toBe(payload.params.limit);
      expect(productsResponse.skip, 'skip').toBe(payload.params.skip);
    });
  });
});
