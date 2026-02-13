import { test as base, expect, request, type APIRequestContext } from '@playwright/test';
import { ProductsClient } from '../../src/api/clients/products.client';

type Fixtures = {
  products: ProductsClient;
};

export const test = base.extend<Fixtures>({
  products: async ({ request }, use) => {
    await use(new ProductsClient(request));
  },
});

export { expect };
