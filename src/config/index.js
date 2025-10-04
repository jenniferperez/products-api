/**
 * Punto de entrada principal para todas las configuraciones
 * Exporta todas las configuraciones organizadas por categoría
 */

const swaggerConfig = require('./swagger');
const securityConfig = require('./security');
const appConfig = require('./app');

module.exports = {
  // Configuración de Swagger
  ...swaggerConfig,

  // Configuración de seguridad
  ...securityConfig,

  // Configuración general de la aplicación
  ...appConfig
};
