/**
 * Tests unitarios para productController
 */

const { testProducts } = require('../fixtures/testData');

// Mock de las dependencias
jest.mock('../../services', () => ({
  productService: {
    getProducts: jest.fn(),
    getProductById: jest.fn(),
    getBulkProducts: jest.fn(),
    getProductStats: jest.fn(),
    getProductsByPriceRange: jest.fn(),
    getProductsByRating: jest.fn(),
    searchProductsBySpecification: jest.fn()
  },
  businessValidationService: {
    validatePaginationParams: jest.fn(),
    validateSearchParams: jest.fn(),
    validatePriceParams: jest.fn(),
    validateRatingParams: jest.fn(),
    validateSpecificationParams: jest.fn(),
    validateIdsParams: jest.fn()
  }
}));

const { productService, businessValidationService } = require('../../services');

// Importar el controlador después de los mocks
const productController = require('../../controllers/productController');

describe('productController', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      query: {},
      params: {},
      body: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('getProducts', () => {
    test('should return products with pagination', async () => {
      const mockResult = {
        products: testProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        },
        searchTerm: ''
      };

      businessValidationService.validatePaginationParams.mockReturnValue({ page: 1, limit: 10 });
      businessValidationService.validateSearchParams.mockReturnValue({ query: '' });
      productService.getProducts.mockResolvedValue(mockResult);

      await productController.getProducts(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(businessValidationService.validatePaginationParams).toHaveBeenCalledWith({ page: undefined, limit: undefined });
      expect(businessValidationService.validateSearchParams).toHaveBeenCalledWith({ query: undefined });
      expect(productService.getProducts).toHaveBeenCalledWith({ page: 1, limit: 10, query: '' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testProducts,
        pagination: mockResult.pagination,
        searchTerm: ''
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle validation error', async () => {
      const mockError = new Error('Validation error');
      businessValidationService.validatePaginationParams.mockImplementation(() => {
        throw mockError;
      });

      await productController.getProducts(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle service error', async () => {
      const mockError = new Error('Service error');
      businessValidationService.validatePaginationParams.mockReturnValue({ page: 1, limit: 10 });
      businessValidationService.validateSearchParams.mockReturnValue({ query: '' });
      productService.getProducts.mockRejectedValue(mockError);

      await productController.getProducts(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: 'Service error',
          code: 'VALIDATION_ERROR'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('getProduct', () => {
    test('should return single product', async () => {
      const mockResult = {
        product: testProducts[0],
        found: true
      };

      productService.getProductById.mockResolvedValue(mockResult);

      mockReq.params.id = '1';

      await productController.getProduct(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(productService.getProductById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: testProducts[0],
        found: true
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle product not found', async () => {
      const mockError = new Error('Product not found');
      mockError.statusCode = 404;
      productService.getProductById.mockRejectedValue(mockError);

      mockReq.params.id = '999';

      await productController.getProduct(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('getBulkProducts', () => {
    test('should return multiple products', async () => {
      const mockResult = {
        products: [testProducts[0], testProducts[1]],
        count: 2,
        requestedIds: [1, 2],
        foundIds: [1, 2]
      };

      businessValidationService.validateIdsParams.mockReturnValue({ ids: '1,2' });
      productService.getBulkProducts.mockResolvedValue(mockResult);

      mockReq.query.ids = '1,2';

      await productController.getBulkProducts(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(businessValidationService.validateIdsParams).toHaveBeenCalledWith({ ids: '1,2' });
      expect(productService.getBulkProducts).toHaveBeenCalledWith('1,2');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.products,
        count: 2,
        requestedIds: [1, 2],
        foundIds: [1, 2]
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle validation error', async () => {
      const mockError = new Error('Validation error');
      businessValidationService.validateIdsParams.mockImplementation(() => {
        throw mockError;
      });

      mockReq.query.ids = '1,2';

      await productController.getBulkProducts(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('getProductStats', () => {
    test('should return product statistics', async () => {
      const mockResult = {
        total: 3,
        averagePrice: 816.66,
        averageRating: 4.7,
        priceRange: { min: 249.99, max: 1199.99 },
        ratingRange: { min: 4.6, max: 4.8 },
        categories: {},
        priceSegments: {},
        ratingDistribution: {}
      };

      productService.getProductStats.mockResolvedValue(mockResult);

      await productController.getProductStats(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(productService.getProductStats).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle service error', async () => {
      const mockError = new Error('Stats error');
      productService.getProductStats.mockRejectedValue(mockError);

      await productController.getProductStats(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: 'Stats error',
          code: 'INTERNAL_ERROR'
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('getProductsByPriceRange', () => {
    test('should return products filtered by price range', async () => {
      const mockResult = {
        products: [testProducts[0], testProducts[1]],
        count: 2,
        priceRange: { min: 100, max: 500 },
        analysis: {}
      };

      businessValidationService.validatePriceParams.mockReturnValue({ min: 100, max: 500 });
      productService.getProductsByPriceRange.mockResolvedValue(mockResult);

      mockReq.query.minPrice = 100;
      mockReq.query.maxPrice = 500;

      await productController.getProductsByPriceRange(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(businessValidationService.validatePriceParams).toHaveBeenCalledWith({ minPrice: 100, maxPrice: 500 });
      expect(productService.getProductsByPriceRange).toHaveBeenCalledWith({ min: 100, max: 500 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.products,
        count: 2,
        priceRange: { min: 100, max: 500 },
        analysis: {}
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('getProductsByRating', () => {
    test('should return products filtered by rating', async () => {
      const mockResult = {
        products: [testProducts[0], testProducts[1]],
        count: 2,
        minRating: 4.7,
        analysis: {}
      };

      businessValidationService.validateRatingParams.mockReturnValue({ min: 4.7 });
      productService.getProductsByRating.mockResolvedValue(mockResult);

      mockReq.query.minRating = 4.7;

      await productController.getProductsByRating(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(businessValidationService.validateRatingParams).toHaveBeenCalledWith({ minRating: 4.7 });
      expect(productService.getProductsByRating).toHaveBeenCalledWith({ min: 4.7 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.products,
        count: 2,
        minRating: 4.7,
        analysis: {}
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('searchProductsBySpec', () => {
    test('should return products matching specification', async () => {
      const mockResult = {
        products: [testProducts[0]],
        count: 1,
        searchTerm: '6.1',
        analysis: {}
      };

      businessValidationService.validateSpecificationParams.mockReturnValue({ spec: '6.1' });
      productService.searchProductsBySpecification.mockResolvedValue(mockResult);

      mockReq.query.spec = '6.1';

      await productController.searchProductsBySpec(mockReq, mockRes, mockNext);

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(businessValidationService.validateSpecificationParams).toHaveBeenCalledWith({ spec: '6.1' });
      expect(productService.searchProductsBySpecification).toHaveBeenCalledWith({ spec: '6.1' });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.products,
        count: 1,
        searchTerm: '6.1',
        analysis: {}
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
