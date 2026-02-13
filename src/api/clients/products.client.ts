import type { APIRequestContext } from '@playwright/test';
import { apiRequest } from '../transport/api-request';
import type { ProductsListResponse } from '../types/product';

export class ProductsClient {
  constructor(private readonly api: APIRequestContext) {}

  async getProducts(params?: {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: string;
    order?: string;
  }) {
    return apiRequest<ProductsListResponse>(this.api, 'GET', '/products', { params });
  }

  // getProductById(id)
  // searchProducts()
  // createProduct()
  // updateProduct()
  // deleteProduct()
}
