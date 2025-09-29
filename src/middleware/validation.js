const Joi = require('joi');
const { sanitizeInput } = require('../utils');

/**
 * Esquemas de validación para los endpoints de productos
 * Previene ataques de inyección y asegura que los datos cumplan con el formato esperado
 */

/**
 * Esquema para validar parámetros de paginación
 * Previene ataques de DoS mediante valores extremos en paginación
 */
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .max(1000) // Límite máximo para prevenir ataques DoS
    .default(1)
    .messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página debe ser mayor a 0',
      'number.max': 'La página no puede ser mayor a 1000'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100) // Límite máximo de productos por página
    .default(10)
    .messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite debe ser mayor a 0',
      'number.max': 'El límite no puede ser mayor a 100'
    }),
  
  q: Joi.string()
    .max(100) // Límite de caracteres para prevenir ataques
    .optional()
    .allow('')
    .messages({
      'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
    })
});

/**
 * Esquema para validar ID de producto
 * Previene inyección de código malicioso en parámetros
 */
const productIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser un número positivo',
      'any.required': 'El ID es requerido'
    })
});

/**
 * Esquema para validar múltiples IDs en query parameter
 * Previene ataques de DoS con listas excesivamente largas
 */
const bulkIdsSchema = Joi.object({
  ids: Joi.string()
    .pattern(/^[0-9,]+$/) // Solo números y comas
    .max(500) // Límite de caracteres para prevenir ataques
    .required()
    .custom((value, helpers) => {
      const ids = value.split(',').map(id => parseInt(id.trim()));
      
      // Validar que no haya más de 20 IDs
      if (ids.length > 20) {
        return helpers.error('custom.maxIds');
      }
      
      // Validar que todos los IDs sean números positivos
      const invalidIds = ids.filter(id => isNaN(id) || id <= 0);
      if (invalidIds.length > 0) {
        return helpers.error('custom.invalidIds');
      }
      
      return ids;
    })
    .messages({
      'string.pattern.base': 'Los IDs deben ser números separados por comas',
      'string.max': 'La lista de IDs es demasiado larga',
      'custom.maxIds': 'No se pueden solicitar más de 20 productos a la vez',
      'custom.invalidIds': 'Todos los IDs deben ser números positivos'
    })
});

/**
 * Middleware genérico para validar query parameters
 * @param {Object} schema - Esquema de Joi para validar
 * @returns {Function} Middleware de Express
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false, // Mostrar todos los errores
      stripUnknown: true, // Eliminar campos no definidos en el esquema
      convert: true // Convertir tipos automáticamente
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: {
          message: 'Parámetros de consulta inválidos',
          code: 'INVALID_QUERY_PARAMS',
          details: errorDetails
        }
      });
    }

    // Reemplazar req.query con los valores validados y convertidos
    req.query = value;
    next();
  };
};

/**
 * Middleware genérico para validar parámetros de ruta
 * @param {Object} schema - Esquema de Joi para validar
 * @returns {Function} Middleware de Express
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: {
          message: 'Parámetros de ruta inválidos',
          code: 'INVALID_ROUTE_PARAMS',
          details: errorDetails
        }
      });
    }

    req.params = value;
    next();
  };
};

module.exports = {
  paginationSchema,
  productIdSchema,
  bulkIdsSchema,
  validateQuery,
  validateParams,
  sanitizeInput
};
