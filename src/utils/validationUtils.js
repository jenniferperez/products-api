/**
 * Utilidades para validación y sanitización
 * Proporciona funciones para validar datos y prevenir ataques XSS
 */

/**
 * Middleware para sanitizar strings y prevenir XSS
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const sanitizeInput = (req, res, next) => {
  // Función para sanitizar strings
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
      .replace(/<[^>]*>/g, '') // Remover tags HTML
      .replace(/javascript:/gi, '') // Remover javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remover event handlers
      .trim();
  };

  // Sanitizar query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  // Sanitizar body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  next();
};

/**
 * Función para validar parámetros de precio
 * @param {number|string} minPrice - Precio mínimo
 * @param {number|string} maxPrice - Precio máximo
 * @returns {Object} Objeto con min y max validados
 * @throws {Error} Si los parámetros son inválidos
 */
const validatePriceRange = (minPrice, maxPrice) => {
  const min = parseFloat(minPrice) || 0;
  const max = parseFloat(maxPrice) || Infinity;

  if (min < 0 || max < 0 || min > max) {
    throw new Error('Rango de precios inválido');
  }

  return { min, max };
};

/**
 * Función para validar parámetro de rating
 * @param {number|string} minRating - Rating mínimo
 * @returns {number} Rating validado
 * @throws {Error} Si el rating es inválido
 */
const validateRating = (minRating) => {
  const min = parseFloat(minRating) || 0;

  if (min < 0 || min > 5) {
    throw new Error('Rating mínimo debe estar entre 0 y 5');
  }

  return min;
};

/**
 * Función para validar término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 * @returns {string} Término validado
 * @throws {Error} Si el término es inválido
 */
const validateSearchTerm = (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
    throw new Error('Término de búsqueda requerido');
  }

  return searchTerm.trim();
};

/**
 * Función para convertir string de IDs a array
 * @param {string} idsString - String de IDs separados por comas
 * @returns {Array} Array de IDs numéricos
 * @throws {Error} Si el formato es inválido
 */
const parseIdsString = (idsString) => {
  if (!idsString || typeof idsString !== 'string') {
    throw new Error('Parámetro ids es requerido');
  }

  const ids = idsString.split(',').map(id => parseInt(id.trim()));

  // Validar que todos los IDs sean números válidos
  const invalidIds = ids.filter(id => isNaN(id) || id <= 0);
  if (invalidIds.length > 0) {
    throw new Error('Todos los IDs deben ser números positivos');
  }

  return ids;
};

module.exports = {
  sanitizeInput,
  validatePriceRange,
  validateRating,
  validateSearchTerm,
  parseIdsString
};
