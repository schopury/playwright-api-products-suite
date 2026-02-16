import { z } from 'zod';

export const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

export const ReviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string(),
});

export const ProductMetaSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  barcode: z.string(),
  qrCode: z.string(),
});

export const ProductSchema = z.object({
  id: z.number().positive(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),
  dimensions: DimensionsSchema,
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(ReviewSchema),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  meta: ProductMetaSchema,
  thumbnail: z.string(),
  images: z.array(z.string()),
});

export const ProductsListResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const CreateProductRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  price: z.number().optional(),
});

export const CreateProductResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number().optional(),
  discountPercentage: z.number().optional(),
  stock: z.number().optional(),
  rating: z.number().optional(),
  images: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

export const DeleteProductSchema = z.object({
  id: z.number(),
  isDeleted: z.boolean(),
  deletedOn: z.string(),
});

export const CategoryListSchema = z.array(z.string().min(1)).nonempty();

export const CategoryObjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
});

export const ProductCategoriesSchema = z.array(CategoryObjectSchema);
