import type { z } from 'zod';

import type {
  ProductSchema,
  ProductsListResponseSchema,
  CreateProductRequestSchema,
  CreateProductResponseSchema,
  DeleteProductSchema,
  CategoryObjectSchema,
} from '@/api/schemas/product.schema';

export type Product = z.infer<typeof ProductSchema>;
export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
export type CreateProductRequest = Partial<z.infer<typeof CreateProductRequestSchema>>;
export type CreateProductResponse = z.infer<typeof CreateProductResponseSchema>;
export type UpdateProductRequest = Partial<Product>;
export type DeleteProductResponse = z.infer<typeof DeleteProductSchema>;
export type CategoryObject = z.infer<typeof CategoryObjectSchema>;
