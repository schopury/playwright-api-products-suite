export const PRODUCT_DATA = {
  PAGINATION: {
    DEFAULT_LIMIT: 30,
    DEFAULT_SKIP: 0,
  },
  SELECTION_SCENARIOS: {
    titleAndPriceFirstPage: () => ({
      limit: 5,
      skip: 0,
      select: 'price,title',
      expected: ['id', 'price', 'title'],
    }),
    titleAndPriceOffsetPage: () => ({
      limit: 3,
      skip: 3,
      select: 'price,title',
      expected: ['id', 'price', 'title'],
    }),
    idOnly: () => ({
      limit: 3,
      skip: 3,
      select: 'id',
      expected: ['id'],
    }),
  } as Record<string, () => SelectCaseOptions>,
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
  SEARCH_SCENARIOS: {
    caseInsensitive: () => ({ query: 'IPHONE', expected: 'iPhone' }),
    partialMatch: () => ({ query: 'lap', expected: 'Laptop' }),
    multiWordSearch: () => ({ query: 'Samsung Galaxy', expected: 'Samsung Galaxy' }),
  } as Record<string, () => SearchCaseOptions>,
  SEARCH: {
    pagination: { query: 'phone', limit: 5, skip: 2 },
  },
  CATEGORY_SCENARIOS: {
    baseFilter: () => ({ category: 'smartphones', params: {} }),
    paginatedFilter: () => ({ category: 'smartphones', params: { limit: 5, skip: 2 } }),
  },
  ID: {
    existing: 1,
    nonExisting: 999999,
  },
};

export type SearchCaseOptions = {
  query: string;
  expected: string;
};

export type SelectCaseOptions = {
  limit: number;
  skip: number;
  select: string;
  expected: string[];
};
