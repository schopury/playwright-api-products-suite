import { test as base, expect } from '@playwright/test';
import { ProductsClient } from '../../src/api/clients/products.client';

type Fixtures = {
  products: ProductsClient;
  created: {
    productIds: number[];
  };
};

export const test = base.extend<Fixtures>({
  products: async ({ request }, use) => {
    await use(new ProductsClient(request));
  },

  created: async ({ products }, use) => {
    const store = { productIds: [] as number[] };

    await use(store);

    for (const id of store.productIds) {
      try {
        const res = await products.deleteProduct(id);
        if (res.status >= 500) {
          console.warn(`Cleanup 5xx for id=${id}`);
        }
      } catch (error) {
        console.warn(`Cleanup failed for id=${id}:`, error);
      }
    }
  },
});

export { expect };
