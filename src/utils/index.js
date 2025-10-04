/**
 * Punto de entrada principal para todas las utilidades
 * Exporta todas las funciones de utilidad organizadas por categoría
 */

const errorUtils = require('./errorUtils');
const validationUtils = require('./validationUtils');
const dataUtils = require('./dataUtils');

module.exports = {
  // Utilidades de manejo de errores
  ...errorUtils,

  // Utilidades de validación
  ...validationUtils,

  // Utilidades de datos y cálculos
  ...dataUtils
};
