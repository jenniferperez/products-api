require('dotenv').config();
const express = require('express');

// Importar configuraciones
const {
  helmetConfig,
  corsConfig,
  rateLimitConfig,
  requestLogger,
  validateOrigin,
  setupSwagger,
  config,
  isDevelopment,
  isProduction,
  getApiBaseUrl,
  getDocsUrl
} = require('./config');

// Importar middleware de manejo de errores
const {
  handleJoiError,
  handleJsonSyntaxError,
  handleAppError,
  handleUnhandledError,
  handleNotFound,
  handleMethodNotAllowed
} = require('./middleware/errorHandler');

// Importar rutas
const productRoutes = require('./routes/productRoutes');

/**
 * Aplicación principal de Express
 * Configuración completa con middleware de seguridad, validación y documentación
 */
const app = express();

// Configurar puerto y ambiente
const PORT = config.server.port;
const NODE_ENV = config.server.environment;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Información de la API
 *     description: Endpoint de bienvenida con información básica de la API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Información de la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bienvenido a la Products API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 environment:
 *                   type: string
 *                   example: "development"
 *                 documentation:
 *                   type: string
 *                   example: "/api-docs"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: string
 *                       example: "/api/products"
 *                     docs:
 *                       type: string
 *                       example: "/api-docs"
 */

// ==================== MIDDLEWARE DE SEGURIDAD ====================

// Helmet: Cabeceras HTTP seguras
// Mitiga: XSS, clickjacking, MIME sniffing, información del servidor
app.use(helmetConfig);

// CORS: Control de acceso de origen cruzado
// Mitiga: Ataques CSRF, acceso no autorizado desde dominios maliciosos
app.use(corsConfig);

// Rate Limiting: Límite de velocidad
// Mitiga: Ataques DDoS, fuerza bruta, abuso de API
app.use(rateLimitConfig);

// Validación de origen (solo en producción)
// Mitiga: Ataques de origen cruzado maliciosos
if (isProduction()) {
  app.use(validateOrigin);
}

// ==================== MIDDLEWARE GENERAL ====================

// Parser para JSON
app.use(express.json({ limit: '10mb' }));

// Parser para URL encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de requests (solo en desarrollo)
if (isDevelopment()) {
  app.use(requestLogger);
}

// ==================== RUTAS ====================

// Endpoint de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la Products API',
    version: config.api.version,
    environment: NODE_ENV,
    documentation: config.api.docsUrl,
    endpoints: {
      products: config.api.baseUrl + '/products',
      docs: config.api.docsUrl
    },
    features: [
      'Lista paginada de productos',
      'Búsqueda de productos',
      'Múltiples productos por ID',
      'Estadísticas de productos',
      'Búsqueda por precio y rating',
      'Documentación interactiva con Swagger'
    ]
  });
});

// Rutas de productos
app.use(config.api.baseUrl + '/products', productRoutes);

// ==================== CONFIGURACIÓN DE SWAGGER ====================

// Configurar documentación de Swagger
setupSwagger(app);

// ==================== MIDDLEWARE DE MANEJO DE ERRORES ====================

// Manejo de errores de sintaxis JSON
app.use(handleJsonSyntaxError);

// Manejo de errores de validación Joi
app.use(handleJoiError);

// Manejo de errores de la aplicación
app.use(handleAppError);

// Manejo de rutas no encontradas
app.use(handleNotFound);

// Manejo de métodos no permitidos
app.use(handleMethodNotAllowed);

// Manejo de errores no controlados (debe ser el último)
app.use(handleUnhandledError);

// ==================== INICIO DEL SERVIDOR ====================

/**
 * Función para iniciar el servidor
 */
const startServer = () => {
  app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado exitosamente');
    console.log(`📍 Puerto: ${PORT}`);
    console.log(`🌍 Ambiente: ${NODE_ENV}`);
    console.log(`📚 Documentación: ${getDocsUrl()}`);
    console.log(`🔗 API Base URL: ${getApiBaseUrl()}`);
    console.log('='.repeat(50));
    
    if (isDevelopment()) {
      console.log('🔧 Características de desarrollo habilitadas:');
      console.log('   - Logging de requests');
      console.log('   - Stack traces en errores');
      console.log('   - CORS permisivo');
      console.log('   - Documentación Swagger interactiva');
    } else {
      console.log('🛡️ Características de producción habilitadas:');
      console.log('   - CORS restringido');
      console.log('   - Sin stack traces en errores');
      console.log('   - Validación de origen');
    }
  });
};

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('🛑 Señal SIGTERM recibida, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Señal SIGINT recibida, cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  startServer();
}

module.exports = app;
