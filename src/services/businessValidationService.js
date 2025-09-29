/**
 * Servicio de Validación de Negocio
 * Contiene reglas de negocio y validaciones específicas del dominio
 */

const { createError } = require('../utils');

/**
 * Clase BusinessValidationService - Maneja validaciones de negocio
 */
class BusinessValidationService {
  /**
   * Valida parámetros de paginación según reglas de negocio
   * @param {Object} params - Parámetros de paginación
   * @returns {Object} Parámetros validados
   * @throws {Error} Si los parámetros son inválidos
   */
  validatePaginationParams(params) {
    const { page = 1, limit = 10 } = params;
    
    // Reglas de negocio para paginación
    if (page < 1) {
      throw createError('El número de página debe ser mayor a 0', 400, 'INVALID_PAGE');
    }
    
    if (page > 1000) {
      throw createError('El número de página no puede ser mayor a 1000', 400, 'PAGE_TOO_LARGE');
    }
    
    if (limit < 1) {
      throw createError('El límite debe ser mayor a 0', 400, 'INVALID_LIMIT');
    }
    
    if (limit > 100) {
      throw createError('El límite no puede ser mayor a 100', 400, 'LIMIT_TOO_LARGE');
    }
    
    return { page: parseInt(page), limit: parseInt(limit) };
  }

  /**
   * Valida parámetros de búsqueda según reglas de negocio
   * @param {Object} params - Parámetros de búsqueda
   * @returns {Object} Parámetros validados
   * @throws {Error} Si los parámetros son inválidos
   */
  validateSearchParams(params) {
    const { query = '' } = params;
    
    // Reglas de negocio para búsqueda
    if (typeof query !== 'string') {
      throw createError('El término de búsqueda debe ser una cadena de texto', 400, 'INVALID_QUERY_TYPE');
    }
    
    if (query.length > 100) {
      throw createError('El término de búsqueda no puede exceder 100 caracteres', 400, 'QUERY_TOO_LONG');
    }
    
    // Sanitizar término de búsqueda
    const sanitizedQuery = query.trim().replace(/[<>]/g, '');
    
    return { query: sanitizedQuery };
  }

  /**
   * Valida parámetros de precio según reglas de negocio
   * @param {Object} params - Parámetros de precio
   * @returns {Object} Parámetros validados
   * @throws {Error} Si los parámetros son inválidos
   */
  validatePriceParams(params) {
    const { minPrice, maxPrice } = params;
    
    // Reglas de negocio para precios
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    
    if (min < 0) {
      throw createError('El precio mínimo no puede ser negativo', 400, 'NEGATIVE_MIN_PRICE');
    }
    
    if (max < 0) {
      throw createError('El precio máximo no puede ser negativo', 400, 'NEGATIVE_MAX_PRICE');
    }
    
    if (min > max) {
      throw createError('El precio mínimo no puede ser mayor al precio máximo', 400, 'INVALID_PRICE_RANGE');
    }
    
    if (max > 1000000) {
      throw createError('El precio máximo no puede exceder $1,000,000', 400, 'PRICE_TOO_HIGH');
    }
    
    return { min, max };
  }

  /**
   * Valida parámetros de rating según reglas de negocio
   * @param {Object} params - Parámetros de rating
   * @returns {Object} Parámetros validados
   * @throws {Error} Si los parámetros son inválidos
   */
  validateRatingParams(params) {
    const { minRating } = params;
    
    // Reglas de negocio para rating
    const min = parseFloat(minRating) || 0;
    
    if (min < 0) {
      throw createError('El rating mínimo no puede ser negativo', 400, 'NEGATIVE_RATING');
    }
    
    if (min > 5) {
      throw createError('El rating mínimo no puede ser mayor a 5', 400, 'RATING_TOO_HIGH');
    }
    
    return { min };
  }

  /**
   * Valida parámetros de especificación según reglas de negocio
   * @param {Object} params - Parámetros de especificación
   * @returns {Object} Parámetros validados
   * @throws {Error} Si los parámetros son inválidos
   */
  validateSpecificationParams(params) {
    const { spec } = params;
    
    // Reglas de negocio para especificaciones
    if (!spec || typeof spec !== 'string') {
      throw createError('La especificación es requerida', 400, 'MISSING_SPEC');
    }
    
    const trimmedSpec = spec.trim();
    
    if (trimmedSpec.length === 0) {
      throw createError('La especificación no puede estar vacía', 400, 'EMPTY_SPEC');
    }
    
    if (trimmedSpec.length > 200) {
      throw createError('La especificación no puede exceder 200 caracteres', 400, 'SPEC_TOO_LONG');
    }
    
    // Sanitizar especificación
    const sanitizedSpec = trimmedSpec.replace(/[<>]/g, '');
    
    return { spec: sanitizedSpec };
  }

  /**
   * Valida parámetros de IDs según reglas de negocio
   * @param {Object} params - Parámetros de IDs
   * @returns {Object} Parámetros validados
   * @throws {Error} Si los parámetros son inválidos
   */
  validateIdsParams(params) {
    const { ids } = params;
    
    // Reglas de negocio para IDs
    if (!ids || typeof ids !== 'string') {
      throw createError('Los IDs son requeridos', 400, 'MISSING_IDS');
    }
    
    const idsArray = ids.split(',').map(id => id.trim());
    
    if (idsArray.length === 0) {
      throw createError('Debe proporcionar al menos un ID', 400, 'NO_IDS');
    }
    
    if (idsArray.length > 20) {
      throw createError('No se pueden solicitar más de 20 productos a la vez', 400, 'TOO_MANY_IDS');
    }
    
    // Validar que todos los IDs sean números positivos
    const numericIds = [];
    for (const id of idsArray) {
      const numericId = parseInt(id);
      if (isNaN(numericId) || numericId <= 0) {
        throw createError(`ID inválido: ${id}`, 400, 'INVALID_ID');
      }
      numericIds.push(numericId);
    }
    
    return { ids: numericIds };
  }

  /**
   * Valida que un producto cumple con las reglas de negocio
   * @param {Object} product - Producto a validar
   * @returns {Object} Producto validado
   * @throws {Error} Si el producto no cumple las reglas
   */
  validateProductBusinessRules(product) {
    // Reglas de negocio para productos
    if (!product) {
      throw createError('El producto es requerido', 400, 'MISSING_PRODUCT');
    }
    
    if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
      throw createError('El nombre del producto es requerido', 400, 'INVALID_NAME');
    }
    
    if (product.name.length > 200) {
      throw createError('El nombre del producto no puede exceder 200 caracteres', 400, 'NAME_TOO_LONG');
    }
    
    if (typeof product.price !== 'number' || product.price < 0) {
      throw createError('El precio debe ser un número positivo', 400, 'INVALID_PRICE');
    }
    
    if (product.price > 1000000) {
      throw createError('El precio no puede exceder $1,000,000', 400, 'PRICE_TOO_HIGH');
    }
    
    if (typeof product.rating !== 'number' || product.rating < 0 || product.rating > 5) {
      throw createError('El rating debe ser un número entre 0 y 5', 400, 'INVALID_RATING');
    }
    
    if (!product.description || typeof product.description !== 'string' || product.description.trim().length === 0) {
      throw createError('La descripción del producto es requerida', 400, 'INVALID_DESCRIPTION');
    }
    
    if (product.description.length > 1000) {
      throw createError('La descripción no puede exceder 1000 caracteres', 400, 'DESCRIPTION_TOO_LONG');
    }
    
    return product;
  }

  /**
   * Valida que los resultados de una operación cumplan con las reglas de negocio
   * @param {Array} results - Resultados a validar
   * @param {string} operation - Tipo de operación
   * @returns {Object} Resultados validados
   * @throws {Error} Si los resultados no cumplen las reglas
   */
  validateOperationResults(results, operation) {
    if (!Array.isArray(results)) {
      throw createError('Los resultados deben ser un array', 500, 'INVALID_RESULTS_TYPE');
    }
    
    // Reglas de negocio para resultados
    switch (operation) {
      case 'search':
        if (results.length === 0) {
          return {
            results,
            message: 'No se encontraron productos que coincidan con los criterios de búsqueda',
            suggestions: [
              'Intenta con términos de búsqueda más generales',
              'Verifica la ortografía de los términos utilizados',
              'Considera ampliar los rangos de precio o rating'
            ]
          };
        }
        break;
        
      case 'filter':
        if (results.length === 0) {
          return {
            results,
            message: 'No se encontraron productos que cumplan con los filtros aplicados',
            suggestions: [
              'Intenta relajar los criterios de filtrado',
              'Verifica que los valores de filtro sean correctos'
            ]
          };
        }
        break;
        
      case 'bulk':
        if (results.length === 0) {
          throw createError('No se encontraron productos con los IDs especificados', 404, 'NO_PRODUCTS_FOUND');
        }
        break;
    }
    
    return {
      results,
      count: results.length,
      message: `Operación ${operation} completada exitosamente`
    };
  }
}

// Crear instancia singleton del servicio
const businessValidationService = new BusinessValidationService();

module.exports = {
  BusinessValidationService,
  businessValidationService
};
