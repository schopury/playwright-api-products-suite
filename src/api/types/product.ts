import { z } from 'zod';

import { ProductSchema, ProductsListResponseSchema } from '../schemas/product.schema';

export type Product = z.infer<typeof ProductSchema>;
export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;
