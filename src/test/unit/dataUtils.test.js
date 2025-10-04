/**
 * Tests unitarios para dataUtils
 */

const {
  calculateProductStats,
  filterProductsByPriceRange,
  filterProductsByRating,
  searchProducts,
  searchProductsBySpecification,
  paginateProducts,
  getProductsByIds,
  getProductById
} = require('../../utils/dataUtils');

const { testProducts } = require('../fixtures/testData');

describe('dataUtils', () => {
  describe('calculateProductStats', () => {
    test('should calculate stats for products array', () => {
      const result = calculateProductStats(testProducts);

      expect(result.total).toBe(3);
      expect(result.averagePrice).toBeCloseTo(816.66, 2);
      expect(result.averageRating).toBeCloseTo(4.7, 2);
      expect(result.priceRange.min).toBe(249.99);
      expect(result.priceRange.max).toBe(1199.99);
      expect(result.ratingRange.min).toBe(4.6);
      expect(result.ratingRange.max).toBe(4.8);
    });

    test('should handle empty array', () => {
      const result = calculateProductStats([]);

      expect(result.total).toBe(0);
      expect(result.averagePrice).toBe(0);
      expect(result.averageRating).toBe(0);
      expect(result.priceRange.min).toBe(0);
      expect(result.priceRange.max).toBe(0);
      expect(result.ratingRange.min).toBe(0);
      expect(result.ratingRange.max).toBe(0);
    });

    test('should handle null input', () => {
      const result = calculateProductStats(null);

      expect(result.total).toBe(0);
      expect(result.averagePrice).toBe(0);
      expect(result.averageRating).toBe(0);
    });

    test('should handle undefined input', () => {
      const result = calculateProductStats(undefined);

      expect(result.total).toBe(0);
      expect(result.averagePrice).toBe(0);
      expect(result.averageRating).toBe(0);
    });
  });

  describe('filterProductsByPriceRange', () => {
    test('should filter products by price range', () => {
      const result = filterProductsByPriceRange(testProducts, 200, 1000);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Test iPhone');
      expect(result[1].name).toBe('Test AirPods');
    });

    test('should handle inclusive range', () => {
      const result = filterProductsByPriceRange(testProducts, 249.99, 249.99);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test AirPods');
    });

    test('should return empty array when no products match', () => {
      const result = filterProductsByPriceRange(testProducts, 2000, 3000);

      expect(result).toHaveLength(0);
    });

    test('should handle empty products array', () => {
      const result = filterProductsByPriceRange([], 100, 500);

      expect(result).toHaveLength(0);
    });
  });

  describe('filterProductsByRating', () => {
    test('should filter products by minimum rating', () => {
      const result = filterProductsByRating(testProducts, 4.7);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Test iPhone');
      expect(result[1].name).toBe('Test MacBook');
    });

    test('should handle inclusive rating', () => {
      const result = filterProductsByRating(testProducts, 4.6);

      expect(result).toHaveLength(3);
    });

    test('should return empty array when no products match', () => {
      const result = filterProductsByRating(testProducts, 5.0);

      expect(result).toHaveLength(0);
    });

    test('should handle zero rating', () => {
      const result = filterProductsByRating(testProducts, 0);

      expect(result).toHaveLength(3);
    });
  });

  describe('searchProducts', () => {
    test('should search products by name', () => {
      const result = searchProducts(testProducts, 'iPhone');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test iPhone');
    });

    test('should search products by description', () => {
      const result = searchProducts(testProducts, 'MacBook');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test MacBook');
    });

    test('should be case insensitive', () => {
      const result = searchProducts(testProducts, 'iphone');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test iPhone');
    });

    test('should return empty array when no matches', () => {
      const result = searchProducts(testProducts, 'Samsung');

      expect(result).toHaveLength(0);
    });

    test('should handle empty search term', () => {
      const result = searchProducts(testProducts, '');

      expect(result).toHaveLength(0);
    });
  });

  describe('searchProductsBySpecification', () => {
    test('should search products by specification value', () => {
      const result = searchProductsBySpecification(testProducts, '6.1');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test iPhone');
    });

    test('should be case insensitive', () => {
      const result = searchProductsBySpecification(testProducts, 'm2');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test MacBook');
    });

    test('should return empty array when no matches', () => {
      const result = searchProductsBySpecification(testProducts, 'Samsung');

      expect(result).toHaveLength(0);
    });

    test('should handle empty search term', () => {
      const result = searchProductsBySpecification(testProducts, '');

      expect(result).toHaveLength(0);
    });
  });

  describe('paginateProducts', () => {
    test('should paginate products correctly', () => {
      const result = paginateProducts(testProducts, 1, 2);

      expect(result.products).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });

    test('should handle second page', () => {
      const result = paginateProducts(testProducts, 2, 2);

      expect(result.products).toHaveLength(1);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(true);
    });

    test('should handle search with pagination', () => {
      const result = paginateProducts(testProducts, 1, 10, 'iPhone');

      expect(result.products).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    test('should handle empty products array', () => {
      const result = paginateProducts([], 1, 10);

      expect(result.products).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('getProductsByIds', () => {
    test('should get products by IDs', () => {
      const result = getProductsByIds(testProducts, [1, 3]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
    });

    test('should handle single ID', () => {
      const result = getProductsByIds(testProducts, [2]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test('should return empty array when no matches', () => {
      const result = getProductsByIds(testProducts, [999]);

      expect(result).toHaveLength(0);
    });

    test('should handle empty IDs array', () => {
      const result = getProductsByIds(testProducts, []);

      expect(result).toHaveLength(0);
    });
  });

  describe('getProductById', () => {
    test('should get product by ID', () => {
      const result = getProductById(testProducts, 1);

      expect(result).toEqual(testProducts[0]);
    });

    test('should return null when product not found', () => {
      const result = getProductById(testProducts, 999);

      expect(result).toBeNull();
    });

    test('should handle string ID', () => {
      const result = getProductById(testProducts, '1');

      expect(result).toEqual(testProducts[0]);
    });

    test('should handle empty products array', () => {
      const result = getProductById([], 1);

      expect(result).toBeNull();
    });
  });
});
