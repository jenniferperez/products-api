/**
 * Punto de entrada principal para todos los servicios
 * Exporta todos los servicios organizados por categoría
 */

const productService = require('./productService');
const businessValidationService = require('./businessValidationService');

module.exports = {
  // Servicios de productos
  ...productService,
  
  // Servicios de validación de negocio
  ...businessValidationService
};
