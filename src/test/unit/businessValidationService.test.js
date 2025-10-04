/**
 * Tests unitarios para businessValidationService
 */

// Mock de createError
jest.mock('../../utils', () => ({
  createError: jest.fn()
}));

const { createError } = require('../../utils');

// Importar el servicio después de los mocks
const { businessValidationService } = require('../../services/businessValidationService');

describe('businessValidationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePaginationParams', () => {
    test('should validate correct pagination parameters', () => {
      const result = businessValidationService.validatePaginationParams({
        page: 1,
        limit: 10
      });

      expect(result).toEqual({ page: 1, limit: 10 });
    });

    test('should throw error for invalid pagination parameters', () => {
      const mockError = new Error('Validation error');
      createError.mockReturnValue(mockError);

      expect(() => {
        businessValidationService.validatePaginationParams({
          page: 0,
          limit: 101
        });
      }).toThrow('Validation error');

      expect(createError).toHaveBeenCalledWith(
        'El número de página debe ser mayor a 0',
        400,
        'INVALID_PAGE'
      );
    });
  });

  describe('validateSearchParams', () => {
    test('should validate correct search parameters', () => {
      const result = businessValidationService.validateSearchParams({
        query: 'iPhone'
      });

      expect(result).toEqual({ query: 'iPhone' });
    });
  });

  describe('validatePriceParams', () => {
    test('should validate correct price parameters', () => {
      const result = businessValidationService.validatePriceParams({
        minPrice: 100,
        maxPrice: 500
      });

      expect(result).toEqual({ min: 100, max: 500 });
    });

    test('should throw error for invalid price range', () => {
      const mockError = new Error('Price range error');
      createError.mockReturnValue(mockError);

      expect(() => {
        businessValidationService.validatePriceParams({
          minPrice: 500,
          maxPrice: 100
        });
      }).toThrow('Price range error');

      expect(createError).toHaveBeenCalledWith(
        'El precio mínimo no puede ser mayor al precio máximo',
        400,
        'INVALID_PRICE_RANGE'
      );
    });
  });

  describe('validateRatingParams', () => {
    test('should validate correct rating parameters', () => {
      const result = businessValidationService.validateRatingParams({
        minRating: 4.5
      });

      expect(result).toEqual({ min: 4.5 });
    });
  });

  describe('validateSpecificationParams', () => {
    test('should validate correct specification parameters', () => {
      const result = businessValidationService.validateSpecificationParams({
        spec: 'Bluetooth'
      });

      expect(result).toEqual({ spec: 'Bluetooth' });
    });
  });

  describe('validateIdsParams', () => {
    test('should validate correct IDs parameters', () => {
      const result = businessValidationService.validateIdsParams({
        ids: '1,2,3'
      });

      expect(result).toEqual({ ids: [1, 2, 3] });
    });

    test('should throw error for too many IDs', () => {
      const mockError = new Error('Too many IDs');
      createError.mockReturnValue(mockError);

      expect(() => {
        businessValidationService.validateIdsParams({
          ids: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21'
        });
      }).toThrow('Too many IDs');

      expect(createError).toHaveBeenCalledWith(
        'No se pueden solicitar más de 20 productos a la vez',
        400,
        'TOO_MANY_IDS'
      );
    });
  });

  describe('validateProductBusinessRules', () => {
    test('should validate correct product data', () => {
      const mockProduct = {
        name: 'Test Product',
        description: 'Test product description',
        price: 99.99,
        rating: 4.5
      };

      const result = businessValidationService.validateProductBusinessRules(mockProduct);

      expect(result).toEqual(mockProduct);
    });
  });

  describe('validateOperationResults', () => {
    test('should validate successful operation result', () => {
      const result = ['test', 'data'];

      expect(() => {
        businessValidationService.validateOperationResults(result);
      }).not.toThrow();
    });

    test('should throw error for null result', () => {
      const mockError = new Error('Recurso no encontrado');
      createError.mockReturnValue(mockError);

      expect(() => {
        businessValidationService.validateOperationResults(null);
      }).toThrow('Recurso no encontrado');

      expect(createError).toHaveBeenCalledWith(
        'Los resultados deben ser un array',
        500,
        'INVALID_RESULTS_TYPE'
      );
    });

    test('should throw error for empty array result', () => {
      const mockError = new Error('No se encontraron Recursos');
      createError.mockReturnValue(mockError);

      expect(() => {
        businessValidationService.validateOperationResults([], 'bulk');
      }).toThrow('No se encontraron Recursos');

      expect(createError).toHaveBeenCalledWith(
        'No se encontraron productos con los IDs especificados',
        404,
        'NO_PRODUCTS_FOUND'
      );
    });

    test('should validate with custom entity name', () => {
      const mockError = new Error('Producto no encontrado');
      createError.mockReturnValue(mockError);

      expect(() => {
        businessValidationService.validateOperationResults(null, 'Producto');
      }).toThrow('Producto no encontrado');

      expect(createError).toHaveBeenCalledWith(
        'Los resultados deben ser un array',
        500,
        'INVALID_RESULTS_TYPE'
      );
    });
  });
});
