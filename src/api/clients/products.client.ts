import type { APIRequestContext } from '@playwright/test';
import { apiRequest } from '../transport/api-request';
import type {
  Product,
  ProductsListResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
} from '../types/product';

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

  async createProduct(data: CreateProductRequest = {}) {
    return apiRequest<CreateProductResponse>(this.api, 'POST', '/products/add', { data });
  }

  async deleteProduct(id: number) {
    return apiRequest(this.api, 'DELETE', `/products/${id}`);
  }

  async getProductById(id: number) {
    return apiRequest<Product>(this.api, 'GET', `/products/${id}`);
  }

  async updateProduct(id: number, data: UpdateProductRequest) {
    return apiRequest<Product>(this.api, 'PATCH', `/products/${id}`, { data });
  }

  async searchProducts(params: { q: string; limit?: number; skip?: number; select?: string }) {
    return apiRequest<ProductsListResponse>(this.api, 'GET', '/products/search', { params });
  }
}
