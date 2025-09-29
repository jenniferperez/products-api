/**
 * Tests unitarios para validationUtils
 */

const { 
  sanitizeInput, 
  validatePriceRange, 
  validateRating, 
  validateSearchTerm, 
  parseIdsString 
} = require('../../utils/validationUtils');

describe('validationUtils', () => {
  describe('sanitizeInput', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
      mockReq = {
        query: {},
        body: {}
      };
      mockRes = {};
      mockNext = jest.fn();
    });

    test('should sanitize query parameters', () => {
      mockReq.query = {
        search: '<script>alert("xss")</script>iPhone',
        description: 'Product <b>description</b>'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.query.search).toBe('iPhone');
      expect(mockReq.query.description).toBe('Product description');
      expect(mockNext).toHaveBeenCalled();
    });

    test('should sanitize body parameters', () => {
      mockReq.body = {
        name: '<script>alert("xss")</script>Product Name',
        description: 'Product <img src="x" onerror="alert(1)">description'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.body.name).toBe('Product Name');
      expect(mockReq.body.description).toBe('Product description');
      expect(mockNext).toHaveBeenCalled();
    });

    test('should handle non-string values', () => {
      mockReq.query = {
        page: 1,
        limit: 10,
        search: 'iPhone'
      };

      sanitizeInput(mockReq, mockRes, mockNext);

      expect(mockReq.query.page).toBe(1);
      expect(mockReq.query.limit).toBe(10);
      expect(mockReq.query.search).toBe('iPhone');
      expect(mockNext).toHaveBeenCalled();
    });

    test('should handle empty objects', () => {
      sanitizeInput(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validatePriceRange', () => {
    test('should validate correct price range', () => {
      const result = validatePriceRange(100, 500);
      expect(result).toEqual({ min: 100, max: 500 });
    });

    test('should handle string inputs', () => {
      const result = validatePriceRange('100', '500');
      expect(result).toEqual({ min: 100, max: 500 });
    });

    test('should handle undefined maxPrice', () => {
      const result = validatePriceRange(100, undefined);
      expect(result).toEqual({ min: 100, max: Infinity });
    });

    test('should handle zero values', () => {
      const result = validatePriceRange(0, 0);
      expect(result).toEqual({ min: 0, max: Infinity });
    });

    test('should throw error for negative minPrice', () => {
      expect(() => {
        validatePriceRange(-1, 500);
      }).toThrow('Rango de precios inválido');
    });

    test('should throw error for negative maxPrice', () => {
      expect(() => {
        validatePriceRange(100, -1);
      }).toThrow('Rango de precios inválido');
    });

    test('should throw error when min > max', () => {
      expect(() => {
        validatePriceRange(500, 100);
      }).toThrow('Rango de precios inválido');
    });
  });

  describe('validateRating', () => {
    test('should validate correct rating', () => {
      const result = validateRating(4.5);
      expect(result).toBe(4.5);
    });

    test('should handle string input', () => {
      const result = validateRating('4.5');
      expect(result).toBe(4.5);
    });

    test('should handle zero rating', () => {
      const result = validateRating(0);
      expect(result).toBe(0);
    });

    test('should handle maximum rating', () => {
      const result = validateRating(5);
      expect(result).toBe(5);
    });

    test('should throw error for negative rating', () => {
      expect(() => {
        validateRating(-1);
      }).toThrow('Rating mínimo debe estar entre 0 y 5');
    });

    test('should throw error for rating > 5', () => {
      expect(() => {
        validateRating(6);
      }).toThrow('Rating mínimo debe estar entre 0 y 5');
    });

    test('should handle undefined input', () => {
      const result = validateRating(undefined);
      expect(result).toBe(0);
    });
  });

  describe('validateSearchTerm', () => {
    test('should validate correct search term', () => {
      const result = validateSearchTerm('iPhone');
      expect(result).toBe('iPhone');
    });

    test('should trim whitespace', () => {
      const result = validateSearchTerm('  iPhone  ');
      expect(result).toBe('iPhone');
    });

    test('should throw error for empty string', () => {
      expect(() => {
        validateSearchTerm('');
      }).toThrow('Término de búsqueda requerido');
    });

    test('should throw error for whitespace only', () => {
      expect(() => {
        validateSearchTerm('   ');
      }).toThrow('Término de búsqueda requerido');
    });

    test('should throw error for null input', () => {
      expect(() => {
        validateSearchTerm(null);
      }).toThrow('Término de búsqueda requerido');
    });

    test('should throw error for undefined input', () => {
      expect(() => {
        validateSearchTerm(undefined);
      }).toThrow('Término de búsqueda requerido');
    });

    test('should throw error for non-string input', () => {
      expect(() => {
        validateSearchTerm(123);
      }).toThrow('Término de búsqueda requerido');
    });
  });

  describe('parseIdsString', () => {
    test('should parse valid IDs string', () => {
      const result = parseIdsString('1,2,3,4,5');
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    test('should handle single ID', () => {
      const result = parseIdsString('1');
      expect(result).toEqual([1]);
    });

    test('should trim whitespace', () => {
      const result = parseIdsString(' 1 , 2 , 3 ');
      expect(result).toEqual([1, 2, 3]);
    });

    test('should throw error for empty string', () => {
      expect(() => {
        parseIdsString('');
      }).toThrow('Parámetro ids es requerido');
    });

    test('should throw error for null input', () => {
      expect(() => {
        parseIdsString(null);
      }).toThrow('Parámetro ids es requerido');
    });

    test('should throw error for undefined input', () => {
      expect(() => {
        parseIdsString(undefined);
      }).toThrow('Parámetro ids es requerido');
    });

    test('should throw error for non-string input', () => {
      expect(() => {
        parseIdsString(123);
      }).toThrow('Parámetro ids es requerido');
    });

    test('should throw error for invalid ID format', () => {
      expect(() => {
        parseIdsString('1,abc,3');
      }).toThrow('Todos los IDs deben ser números positivos');
    });

    test('should throw error for negative IDs', () => {
      expect(() => {
        parseIdsString('1,-2,3');
      }).toThrow('Todos los IDs deben ser números positivos');
    });

    test('should throw error for zero IDs', () => {
      expect(() => {
        parseIdsString('1,0,3');
      }).toThrow('Todos los IDs deben ser números positivos');
    });
  });
});
