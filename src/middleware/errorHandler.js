/**
 * Middleware centralizado para manejo de errores
 * Proporciona respuestas consistentes y evita exposición de información sensible
 */

const { AppError, createError } = require('../utils');

/**
 * Middleware para manejar errores de Joi (validación)
 * @param {Error} error - Error de Joi
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const handleJoiError = (error, req, res, next) => {
  if (error.isJoi) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: {
        message: 'Datos de entrada inválidos',
        code: 'VALIDATION_ERROR',
        details: errorDetails
      }
    });
  }
  next(error);
};

/**
 * Middleware para manejar errores de sintaxis JSON
 * @param {Error} error - Error de sintaxis JSON
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const handleJsonSyntaxError = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: {
        message: 'JSON inválido en el cuerpo de la petición',
        code: 'INVALID_JSON'
      }
    });
  }
  next(error);
};

/**
 * Middleware para manejar errores de la aplicación
 * @param {Error} error - Error capturado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const handleAppError = (error, req, res, next) => {
  // Si es un error operacional conocido
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    });
  }

  // Si no es un error operacional, pasarlo al siguiente middleware
  next(error);
};

/**
 * Middleware para manejar errores no controlados
 * @param {Error} error - Error no controlado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const handleUnhandledError = (error, req, res, _next) => {
  // Log del error para debugging
  console.error('Error no controlado:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // En producción, no exponer detalles del error
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response = {
    error: {
      message: isDevelopment ? error.message : 'Error interno del servidor',
      code: 'INTERNAL_SERVER_ERROR'
    }
  };

  // En desarrollo, incluir stack trace
  if (isDevelopment) {
    response.error.stack = error.stack;
  }

  res.status(500).json(response);
};

/**
 * Middleware para manejar rutas no encontradas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const handleNotFound = (req, res, next) => {
  const error = createError(
    `Ruta no encontrada: ${req.method} ${req.path}`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

/**
 * Middleware para manejar métodos HTTP no permitidos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const handleMethodNotAllowed = (req, res, next) => {
  const error = createError(
    `Método ${req.method} no permitido para ${req.path}`,
    405,
    'METHOD_NOT_ALLOWED'
  );
  next(error);
};

/**
 * Función para manejar errores asíncronos
 * Wrapper para funciones async que captura errores automáticamente
 * @param {Function} fn - Función async a envolver
 * @returns {Function} Función envuelta que maneja errores
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Función para validar que un producto existe
 * @param {number} productId - ID del producto
 * @returns {Object} Producto encontrado
 * @throws {AppError} Si el producto no existe
 */
const validateProductExists = (productId) => {
  const { getProductById } = require('../data/products');
  const product = getProductById(productId);

  if (!product) {
    throw createError(
      `Producto con ID ${productId} no encontrado`,
      404,
      'PRODUCT_NOT_FOUND'
    );
  }

  return product;
};

/**
 * Función para validar que múltiples productos existen
 * @param {Array} productIds - Array de IDs de productos
 * @returns {Array} Productos encontrados
 * @throws {AppError} Si algún producto no existe
 */
const validateProductsExist = (productIds) => {
  const { getProductsByIds } = require('../data/products');
  const products = getProductsByIds(productIds);

  if (products.length !== productIds.length) {
    const foundIds = products.map(p => p.id);
    const missingIds = productIds.filter(id => !foundIds.includes(id));

    throw createError(
      `Los siguientes productos no fueron encontrados: ${missingIds.join(', ')}`,
      404,
      'PRODUCTS_NOT_FOUND'
    );
  }

  return products;
};

module.exports = {
  AppError,
  createError,
  handleJoiError,
  handleJsonSyntaxError,
  handleAppError,
  handleUnhandledError,
  handleNotFound,
  handleMethodNotAllowed,
  asyncHandler,
  validateProductExists,
  validateProductsExist
};
