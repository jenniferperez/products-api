/**
 * Utilidades para manejo de errores
 * Proporciona clases y funciones para manejo consistente de errores
 */

/**
 * Clase personalizada para errores de la aplicación
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Función para crear errores personalizados
 * @param {string} message - Mensaje del error
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} code - Código de error personalizado
 * @returns {AppError} Instancia del error
 */
const createError = (message, statusCode = 500, code = 'INTERNAL_ERROR') => {
  return new AppError(message, statusCode, code);
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
 * @param {Function} getProductById - Función para obtener producto por ID
 * @returns {Object} Producto encontrado
 * @throws {AppError} Si el producto no existe
 */
const validateProductExists = (productId, getProductById) => {
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
 * @param {Function} getProductsByIds - Función para obtener productos por IDs
 * @returns {Array} Productos encontrados
 * @throws {AppError} Si algún producto no existe
 */
const validateProductsExist = (productIds, getProductsByIds) => {
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
  asyncHandler,
  validateProductExists,
  validateProductsExist
};
