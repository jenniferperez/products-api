/**
 * Tests unitarios para products data module
 */

const {
  getAllProducts,
  getProductById,
  getProductsByIds,
  searchProducts,
  getPaginatedProducts
} = require('../../data/products');

// const { testProducts } = require('../fixtures/testData');

describe('products data module', () => {
  describe('getAllProducts', () => {
    test('should return all products', () => {
      const result = getAllProducts();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('rating');
    });

    test('should return products with valid structure', () => {
      const result = getAllProducts();

      result.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('image_url');
        expect(product).toHaveProperty('rating');
        expect(product).toHaveProperty('specs');

        expect(typeof product.id).toBe('number');
        expect(typeof product.name).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.description).toBe('string');
        expect(typeof product.rating).toBe('number');
        expect(typeof product.specs).toBe('object');
      });
    });
  });

  describe('getProductById', () => {
    test('should return product when found', () => {
      const allProducts = getAllProducts();
      const firstProduct = allProducts[0];

      const result = getProductById(firstProduct.id);

      expect(result).toEqual(firstProduct);
    });

    test('should return null when product not found', () => {
      const result = getProductById(99999);

      expect(result).toBeNull();
    });

    test('should handle string ID', () => {
      const allProducts = getAllProducts();
      const firstProduct = allProducts[0];

      const result = getProductById(firstProduct.id.toString());

      expect(result).toEqual(firstProduct);
    });

    test('should handle invalid ID format', () => {
      const result = getProductById('invalid');

      expect(result).toBeNull();
    });
  });

  describe('getProductsByIds', () => {
    test('should return products when all IDs exist', () => {
      const allProducts = getAllProducts();
      const ids = [allProducts[0].id, allProducts[1].id];

      const result = getProductsByIds(ids);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(ids[0]);
      expect(result[1].id).toBe(ids[1]);
    });

    test('should return only existing products', () => {
      const allProducts = getAllProducts();
      const ids = [allProducts[0].id, 99999, allProducts[1].id];

      const result = getProductsByIds(ids);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(ids[0]);
      expect(result[1].id).toBe(ids[2]);
    });

    test('should return empty array when no IDs match', () => {
      const ids = [99999, 99998, 99997];

      const result = getProductsByIds(ids);

      expect(result).toHaveLength(0);
    });

    test('should handle empty IDs array', () => {
      const result = getProductsByIds([]);

      expect(result).toHaveLength(0);
    });

    test('should handle string IDs', () => {
      const allProducts = getAllProducts();
      const ids = [allProducts[0].id.toString(), allProducts[1].id.toString()];

      const result = getProductsByIds(ids);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(allProducts[0].id);
      expect(result[1].id).toBe(allProducts[1].id);
    });
  });

  describe('searchProducts', () => {
    test('should search products by name', () => {
      const allProducts = getAllProducts();
      const searchTerm = allProducts[0].name.substring(0, 3);

      const result = searchProducts(searchTerm);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(product => product.name.includes(searchTerm))).toBe(true);
    });

    test('should search products by description', () => {
      const allProducts = getAllProducts();
      const searchTerm = allProducts[0].description.substring(0, 5);

      const result = searchProducts(searchTerm);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(product => product.description.includes(searchTerm))).toBe(true);
    });

    test('should be case insensitive', () => {
      const allProducts = getAllProducts();
      const searchTerm = allProducts[0].name.toLowerCase();

      const result = searchProducts(searchTerm);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    test('should return empty array for non-matching search', () => {
      const result = searchProducts('NonExistentProductName12345');

      expect(result).toHaveLength(0);
    });

    test('should handle empty search term', () => {
      const result = searchProducts('');

      expect(result).toHaveLength(0);
    });

    test('should handle null search term', () => {
      const result = searchProducts(null);

      expect(result).toHaveLength(0);
    });
  });

  describe('getPaginatedProducts', () => {
    test('should return paginated products', () => {
      const result = getPaginatedProducts(1, 2);

      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
      expect(result.products).toBeInstanceOf(Array);
      expect(result.products.length).toBeLessThanOrEqual(2);
      expect(result.pagination).toHaveProperty('page');
      expect(result.pagination).toHaveProperty('limit');
      expect(result.pagination).toHaveProperty('total');
      expect(result.pagination).toHaveProperty('totalPages');
      expect(result.pagination).toHaveProperty('hasNext');
      expect(result.pagination).toHaveProperty('hasPrev');
    });

    test('should return correct pagination metadata', () => {
      const allProducts = getAllProducts();
      const totalProducts = allProducts.length;
      const page = 1;
      const limit = 2;

      const result = getPaginatedProducts(page, limit);

      expect(result.pagination.page).toBe(page);
      expect(result.pagination.limit).toBe(limit);
      expect(result.pagination.total).toBe(totalProducts);
      expect(result.pagination.totalPages).toBe(Math.ceil(totalProducts / limit));
      expect(result.pagination.hasNext).toBe(totalProducts > limit);
      expect(result.pagination.hasPrev).toBe(page > 1);
    });

    test('should handle second page', () => {
      const allProducts = getAllProducts();
      const totalProducts = allProducts.length;
      const page = 2;
      const limit = 2;

      const result = getPaginatedProducts(page, limit);

      expect(result.pagination.page).toBe(page);
      expect(result.pagination.limit).toBe(limit);
      expect(result.pagination.total).toBe(totalProducts);
      expect(result.pagination.totalPages).toBe(Math.ceil(totalProducts / limit));
      expect(result.pagination.hasPrev).toBe(true);
    });

    test('should handle search with pagination', () => {
      const allProducts = getAllProducts();
      const searchTerm = allProducts[0].name.substring(0, 3);

      const result = getPaginatedProducts(1, 10, searchTerm);

      expect(result).toHaveProperty('products');
      expect(result).toHaveProperty('pagination');
      expect(result.products).toBeInstanceOf(Array);
      expect(result.pagination.total).toBeLessThanOrEqual(allProducts.length);
    });

    test('should handle page beyond available data', () => {
      const allProducts = getAllProducts();
      const totalProducts = allProducts.length;
      const page = 1000;
      const limit = 10;

      const result = getPaginatedProducts(page, limit);

      expect(result.products).toHaveLength(0);
      expect(result.pagination.page).toBe(page);
      expect(result.pagination.limit).toBe(limit);
      expect(result.pagination.total).toBe(totalProducts);
      expect(result.pagination.totalPages).toBe(Math.ceil(totalProducts / limit));
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrev).toBe(true);
    });

    test('should handle zero limit', () => {
      const result = getPaginatedProducts(1, 0);

      expect(result.products).toHaveLength(0);
      expect(result.pagination.limit).toBe(0);
    });

    test('should handle negative page', () => {
      const result = getPaginatedProducts(-1, 10);

      expect(result.products).toHaveLength(0);
      expect(result.pagination.page).toBe(-1);
    });
  });
});
