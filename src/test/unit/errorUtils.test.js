/**
 * Tests unitarios para errorUtils
 */

const { AppError, createError, asyncHandler, validateProductExists, validateProductsExist } = require('../../utils/errorUtils');
const { testProducts } = require('../fixtures/testData');

describe('errorUtils', () => {
  describe('AppError', () => {
    test('should create AppError instance with correct properties', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
    });

    test('should capture stack trace', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('createError', () => {
    test('should create AppError with default values', () => {
      const error = createError('Test error');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
    });

    test('should create AppError with custom values', () => {
      const error = createError('Custom error', 404, 'NOT_FOUND');

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Custom error');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
    });
  });

  describe('asyncHandler', () => {
    test('should handle successful async function', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      const wrappedFn = asyncHandler(mockFn);
      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle async function error', async () => {
      const mockError = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(mockError);
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      const wrappedFn = asyncHandler(mockFn);
      wrappedFn(mockReq, mockRes, mockNext);

      // Wait for the promise to resolve
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

  });

  describe('validateProductExists', () => {
    test('should return product when it exists', () => {
      const mockGetProductById = jest.fn().mockReturnValue(testProducts[0]);

      const result = validateProductExists(1, mockGetProductById);

      expect(result).toEqual(testProducts[0]);
      expect(mockGetProductById).toHaveBeenCalledWith(1);
    });

    test('should throw error when product does not exist', () => {
      const mockGetProductById = jest.fn().mockReturnValue(null);

      expect(() => {
        validateProductExists(999, mockGetProductById);
      }).toThrow('Producto con ID 999 no encontrado');
    });

    test('should throw AppError with correct properties', () => {
      const mockGetProductById = jest.fn().mockReturnValue(null);

      try {
        validateProductExists(999, mockGetProductById);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
        expect(error.code).toBe('PRODUCT_NOT_FOUND');
      }
    });
  });

  describe('validateProductsExist', () => {
    test('should return products when all exist', () => {
      const mockGetProductsByIds = jest.fn().mockReturnValue([testProducts[0], testProducts[1]]);

      const result = validateProductsExist([1, 2], mockGetProductsByIds);

      expect(result).toEqual([testProducts[0], testProducts[1]]);
      expect(mockGetProductsByIds).toHaveBeenCalledWith([1, 2]);
    });

    test('should throw error when some products do not exist', () => {
      const mockGetProductsByIds = jest.fn().mockReturnValue([testProducts[0]]);

      expect(() => {
        validateProductsExist([1, 2], mockGetProductsByIds);
      }).toThrow('Los siguientes productos no fueron encontrados: 2');
    });

    test('should throw AppError with correct properties', () => {
      const mockGetProductsByIds = jest.fn().mockReturnValue([testProducts[0]]);

      try {
        validateProductsExist([1, 2], mockGetProductsByIds);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
        expect(error.code).toBe('PRODUCTS_NOT_FOUND');
      }
    });
  });
});
