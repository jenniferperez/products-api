/**
 * Configuración general de la aplicación
 * Incluye configuraciones de entorno, puertos y constantes
 */

/**
 * Configuración de entorno
 */
const config = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development'
  },

  // Configuración de la base de datos (para futuras implementaciones)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'products_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password'
  },

  // Configuración de la API
  api: {
    version: '1.0.0',
    baseUrl: process.env.API_BASE_URL || '/api',
    docsUrl: '/api-docs',
    rateLimit: {
      windowMs: 60 * 1000, // 1 minuto
      max: 50, // máximo 50 requests por ventana de tiempo
      searchMax: 20 // máximo 20 búsquedas por minuto
    }
  },

  // Configuración de seguridad
  security: {
    corsOrigins: process.env.NODE_ENV === 'production' 
      ? ['https://tu-dominio.com', 'https://www.tu-dominio.com']
      : true,
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      noSniff: true,
      xssFilter: true,
    }
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.NODE_ENV === 'development'
  },

  // Configuración de Swagger
  swagger: {
    title: 'Products API',
    version: '1.0.0',
    description: 'API RESTful para gestión de productos con Node.js y Express',
    contact: {
      name: 'Tu Nombre',
      email: 'tu-email@ejemplo.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  }
};

/**
 * Función para obtener configuración por ambiente
 * @param {string} key - Clave de configuración
 * @returns {any} Valor de configuración
 */
const getConfig = (key) => {
  const keys = key.split('.');
  let value = config;
  
  for (const k of keys) {
    value = value[k];
    if (value === undefined) {
      return undefined;
    }
  }
  
  return value;
};

/**
 * Función para verificar si estamos en desarrollo
 * @returns {boolean} True si estamos en desarrollo
 */
const isDevelopment = () => {
  return config.server.environment === 'development';
};

/**
 * Función para verificar si estamos en producción
 * @returns {boolean} True si estamos en producción
 */
const isProduction = () => {
  return config.server.environment === 'production';
};

/**
 * Función para obtener la URL base de la API
 * @returns {string} URL base de la API
 */
const getApiBaseUrl = () => {
  const { port, host, environment } = config.server;
  const protocol = environment === 'production' ? 'https' : 'http';
  return `${protocol}://${host}:${port}${config.api.baseUrl}`;
};

/**
 * Función para obtener la URL de documentación
 * @returns {string} URL de documentación
 */
const getDocsUrl = () => {
  const { port, host, environment } = config.server;
  const protocol = environment === 'production' ? 'https' : 'http';
  return `${protocol}://${host}:${port}${config.api.docsUrl}`;
};

module.exports = {
  config,
  getConfig,
  isDevelopment,
  isProduction,
  getApiBaseUrl,
  getDocsUrl
};
