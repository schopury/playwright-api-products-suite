import { test, expect, PRODUCT_DATA } from '@fixtures';
import { expectOkJsonResponse, expectNoServerError } from '@/api/assertions/api-assertions';
import { CreateProductResponseSchema, DeleteProductSchema } from '@/api/schemas/product.schema';

test.describe('Products  | CRUD endpoints', { tag: ['@api'] }, () => {
  test.describe('Product Lifecycle flow', () => {
    test('complete the full Product CRUD lifecycle', async ({ products, created }) => {
      const existingId = PRODUCT_DATA.ID.existing;
      const suffix = `${Date.now()}`;
      let createdId: number;

      await test.step('create a new product', async () => {
        const payload = PRODUCT_DATA.CREATE_VALID.minimal(suffix);
        const res = await products.createProduct(payload);

        expectOkJsonResponse(res);
        const parsedResponse = CreateProductResponseSchema.parse(res.body);

        expect(parsedResponse.id, 'id').toBeGreaterThan(0);
        for (const key of Object.keys(payload) as Array<keyof typeof payload>) {
          expect(parsedResponse[key], `product ${String(key)}`).toEqual(payload[key]);
        }
        createdId = parsedResponse.id;
        created.productIds.push(createdId);
      });
      await test.step('retrive the created product', async () => {
        // NOTE: GET should use the ID returned from Create (createdId).
        // const res = await products.getProductById(createdId);
        const res = await products.getProductById(existingId);

        expectOkJsonResponse(res);

        expect(res.body.id).toBe(existingId);
      });
      await test.step('update the product title and price', async () => {
        const patch = PRODUCT_DATA.UPDATE_PAYLOAD.titleAndPrice(suffix);

        // NOTE: UPDATE should use the ID returned from Create (createdId).
        // const res = await products.updateProduct(createdId, patch);
        const res = await products.updateProduct(existingId, patch);
        expectOkJsonResponse(res);

        expect(res.body.id, 'id').toBe(existingId);
        expect(res.body.title, 'title updated').toBe(patch.title);
        expect(res.body.price, 'title updated').toBe(patch.price);
      });
      await test.step('delete the product', async () => {
        // NOTE: DELETE should use the ID returned from Create (createdId).
        // const res = await products.deleteProduct(createdId);
        const res = await products.deleteProduct(existingId);
        expectOkJsonResponse(res);

        const result = DeleteProductSchema.parse(res.body);
        expect(result.id, 'id').toBe(existingId);

        expect(result.isDeleted, 'isDeleted').toBe(true);
        expect(result.deletedOn, 'deletedOn').toBeTruthy();

        // NOTE: verify that GET /products/:id returns 404 after deletion
      });
    });
  });

  test.describe('Create | POST /products/add', () => {
    test('creat: returns new product with all mentoned fields', async ({ products, created }) => {
      const suffix = `${Date.now()}`;
      const payload = PRODUCT_DATA.CREATE_VALID.full(suffix);

      const res = await products.createProduct(payload);

      expectOkJsonResponse(res);
      const parsedResponse = CreateProductResponseSchema.parse(res.body);

      expect(parsedResponse.id, 'id').toBeGreaterThan(0);
      for (const key of Object.keys(payload) as Array<keyof typeof payload>) {
        expect(parsedResponse[key], `product ${String(key)}`).toEqual(payload[key]);
      }

      created.productIds.push(parsedResponse.id);
    });

    test('creat: invalid payload is handled', { tag: ['@negative'] }, async ({ products }) => {
      const res = await products.createProduct({});

      expectNoServerError(res);
      // NOTE: verify that shows 4xx for invalid payload
    });
  });

  test.describe('Read | GET /products/:id', () => {
    test('get by id: non-existing id is handled', { tag: ['@negative'] }, async ({ products }) => {
      const id = PRODUCT_DATA.ID.nonExisting;

      const res = await products.getProductById(id);
      expectNoServerError(res);
      //  NOTE: verify that shows 4xx for invalid payload
    });
  });

  test.describe('Update | PATCH /products/:id', () => {
    const cases = [
      { name: 'non-existing id', id: PRODUCT_DATA.ID.nonExisting, payload: { title: 'x' } },
      { name: 'invalid payload', id: PRODUCT_DATA.ID.existing, payload: {} },
    ] as const;

    for (const tc of cases) {
      test(`update: ${tc.name} is handled`, { tag: ['@negative'] }, async ({ products }) => {
        const res = await products.updateProduct(tc.id, tc.payload);

        expectNoServerError(res);
        // NOTE: verify that shows 4xx for invalid payload
      });
    }
  });

  test.describe('Delete | DELETE /products/:id', () => {
    test('delete: non-existing id is handled', { tag: ['@negative'] }, async ({ products }) => {
      const id = PRODUCT_DATA.ID.nonExisting;

      const res = await products.deleteProduct(id);

      expectNoServerError(res);
      // NOTE: verify that shows 404 for non-existing id
    });
  });
});
