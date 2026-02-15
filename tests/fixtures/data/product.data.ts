export const PRODUCT_DATA = {
  CREATE_VALID: {
    minimal: (suffix: string) => ({ title: `QA Product ${suffix}` }),
    full: (suffix: string) => ({
      title: `QA Product ${suffix}`,
      price: 123,
      discountPercentage: 12.5,
      stock: 50,
      rating: 4.3,
      images: ['https://example.com/qa-image-1.png', 'https://example.com/qa-image-2.png'],
      thumbnail: 'https://example.com/qa-thumbnail.png',
      description: 'created by api tests',
      brand: 'QA Brand',
      category: 'new',
    }),
  },
  UPDATE_PAYLOAD: {
    titleAndPrice: (suffix: string) => ({
      title: `QA Updated ${suffix}`,
      price: 1234,
    }),
  },
  PAGINATION_SCENARIOS: [
    { limit: 5, skip: 0, expectedCount: 5 },
    { limit: 10, skip: 10, expectedCount: 10 },
  ],
  SEARCH_SCENARIOS: [
    { desc: 'Case insensitive', query: 'IPHONE', expectedTitle: 'iPhone' },
    { desc: 'Partial match', query: 'lap', expectedTitle: 'Laptop' },
    { desc: 'Multi-word search', query: 'Samsung Galaxy', expectedTitle: 'iPhone' },
  ],
  ID: {
    existing: 1,
    nonExisting: 999999,
  },
};
