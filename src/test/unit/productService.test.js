/**
 * Tests unitarios para productService
 */

const { testProducts, testErrors } = require('../fixtures/testData');

// Mock de las dependencias
jest.mock('../../data/products', () => ({
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  getProductsByIds: jest.fn(),
  getPaginatedProducts: jest.fn()
}));

jest.mock('../../utils', () => ({
  calculateProductStats: jest.fn(),
  filterProductsByPriceRange: jest.fn(),
  filterProductsByRating: jest.fn(),
  searchProductsBySpecification: jest.fn(),
  searchProducts: jest.fn(),
  createError: jest.fn(),
  validatePriceRange: jest.fn(),
  validateRating: jest.fn(),
  validateSearchTerm: jest.fn(),
  parseIdsString: jest.fn(),
  validateProductExists: jest.fn(),
  validateProductsExist: jest.fn()
}));

const { 
  getAllProducts, 
  getProductById, 
  getProductsByIds, 
  getPaginatedProducts 
} = require('../../data/products');

const { 
  calculateProductStats, 
  filterProductsByPriceRange, 
  filterProductsByRating, 
  searchProductsBySpecification,
  searchProducts,
  createError,
  validatePriceRange,
  validateRating,
  validateSearchTerm,
  parseIdsString,
  validateProductExists,
  validateProductsExist
} = require('../../utils');

// Importar el servicio después de los mocks
const { productService } = require('../../services/productService');

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    test('should return paginated products with search', async () => {
      const mockResult = {
        products: testProducts.slice(0, 2),
        pagination: {
          page: 1,
          limit: 2,
          total: 3,
          totalPages: 2,
          hasNext: true,
          hasPrev: false
        }
      };

      getPaginatedProducts.mockReturnValue(mockResult);

      const result = await productService.getProducts({
        page: 1,
        limit: 2,
        query: 'iPhone'
      });

      expect(result).toEqual({
        products: mockResult.products,
        pagination: mockResult.pagination,
        searchTerm: 'iPhone'
      });
      expect(getPaginatedProducts).toHaveBeenCalledWith(1, 2, 'iPhone');
    });

    test('should return paginated products without search', async () => {
      const mockResult = {
        products: testProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      getPaginatedProducts.mockReturnValue(mockResult);

      const result = await productService.getProducts({
        page: 1,
        limit: 10,
        query: ''
      });

      expect(result).toEqual({
        products: mockResult.products,
        pagination: mockResult.pagination,
        searchTerm: ''
      });
    });
  });

  describe('getProductById', () => {
    test('should return product when found', async () => {
      validateProductExists.mockReturnValue(testProducts[0]);

      const result = await productService.getProductById(1);

      expect(result).toEqual({
        product: testProducts[0],
        found: true
      });
      expect(validateProductExists).toHaveBeenCalledWith(1, getProductById);
    });

    test('should throw error when product not found', async () => {
      const mockError = new Error('Product not found');
      mockError.statusCode = 404;
      mockError.code = 'PRODUCT_NOT_FOUND';

      validateProductExists.mockImplementation(() => {
        throw mockError;
      });

      await expect(productService.getProductById(999)).rejects.toThrow('Product not found');
    });
  });

  describe('getBulkProducts', () => {
    test('should return products when all found', async () => {
      const foundProducts = [testProducts[0], testProducts[1]];

      parseIdsString.mockReturnValue([1, 2]);
      validateProductsExist.mockReturnValue(foundProducts);

      const result = await productService.getBulkProducts('1,2');

      expect(result).toEqual({
        products: foundProducts,
        count: 2,
        requestedIds: [1, 2],
        foundIds: [1, 2]
      });
      expect(parseIdsString).toHaveBeenCalledWith('1,2');
      expect(validateProductsExist).toHaveBeenCalledWith([1, 2], getProductsByIds);
    });

    test('should throw error when some products not found', async () => {
      const mockError = new Error('Products not found');
      mockError.statusCode = 404;
      mockError.code = 'PRODUCTS_NOT_FOUND';

      parseIdsString.mockReturnValue([1, 2, 999]);
      validateProductsExist.mockImplementation(() => {
        throw mockError;
      });

      await expect(productService.getBulkProducts('1,2,999')).rejects.toThrow('Products not found');
    });
  });

  describe('getProductStats', () => {
    test('should return product statistics with analysis', async () => {
      const mockStats = {
        total: 3,
        averagePrice: 816.66,
        averageRating: 4.7,
        priceRange: { min: 249.99, max: 1199.99 },
        ratingRange: { min: 4.6, max: 4.8 }
      };

      getAllProducts.mockReturnValue(testProducts);
      calculateProductStats.mockReturnValue(mockStats);

      const result = await productService.getProductStats();

      expect(result).toHaveProperty('total', 3);
      expect(result).toHaveProperty('averagePrice');
      expect(result).toHaveProperty('averageRating');
      expect(result).toHaveProperty('priceRange');
      expect(result).toHaveProperty('ratingRange');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('priceSegments');
      expect(result).toHaveProperty('ratingDistribution');
      expect(calculateProductStats).toHaveBeenCalledWith(testProducts);
    });
  });

  describe('getProductsByPriceRange', () => {
    test('should return products filtered by price range', async () => {
      const filteredProducts = [testProducts[0], testProducts[1]];

      getAllProducts.mockReturnValue(testProducts);
      validatePriceRange.mockReturnValue({ min: 100, max: 500 });
      filterProductsByPriceRange.mockReturnValue(filteredProducts);

      const result = await productService.getProductsByPriceRange({
        minPrice: 100,
        maxPrice: 500
      });

      expect(result).toHaveProperty('products', filteredProducts);
      expect(result).toHaveProperty('count', 2);
      expect(result).toHaveProperty('priceRange', { min: 100, max: 500 });
      expect(result).toHaveProperty('analysis');
      expect(filterProductsByPriceRange).toHaveBeenCalledWith(testProducts, 100, 500);
    });

    test('should return empty results with suggestions when no products found', async () => {
      const filteredProducts = [];

      getAllProducts.mockReturnValue(testProducts);
      validatePriceRange.mockReturnValue({ min: 2000, max: 3000 });
      filterProductsByPriceRange.mockReturnValue(filteredProducts);

      const result = await productService.getProductsByPriceRange({
        minPrice: 2000,
        maxPrice: 3000
      });

      expect(result).toHaveProperty('products', filteredProducts);
      expect(result).toHaveProperty('count', 0);
      expect(result).toHaveProperty('priceRange', { min: 2000, max: 3000 });
      expect(result).toHaveProperty('analysis');
    });
  });

  describe('getProductsByRating', () => {
    test('should return products filtered by rating', async () => {
      const filteredProducts = [testProducts[0], testProducts[1]];

      getAllProducts.mockReturnValue(testProducts);
      validateRating.mockReturnValue(4.7);
      filterProductsByRating.mockReturnValue(filteredProducts);

      const result = await productService.getProductsByRating({
        minRating: 4.7
      });

      expect(result).toHaveProperty('products', filteredProducts);
      expect(result).toHaveProperty('count', 2);
      expect(result).toHaveProperty('minRating', 4.7);
      expect(result).toHaveProperty('analysis');
      expect(filterProductsByRating).toHaveBeenCalledWith(testProducts, 4.7);
    });
  });

  describe('searchProductsBySpecification', () => {
    test('should return products matching specification', async () => {
      const filteredProducts = [testProducts[0]];

      getAllProducts.mockReturnValue(testProducts);
      validateSearchTerm.mockReturnValue('6.1');
      searchProductsBySpecification.mockReturnValue(filteredProducts);

      const result = await productService.searchProductsBySpecification({
        spec: '6.1'
      });

      expect(result).toHaveProperty('products', filteredProducts);
      expect(result).toHaveProperty('count', 1);
      expect(result).toHaveProperty('searchTerm', '6.1');
      expect(result).toHaveProperty('analysis');
      expect(searchProductsBySpecification).toHaveBeenCalledWith(testProducts, '6.1');
    });
  });
});