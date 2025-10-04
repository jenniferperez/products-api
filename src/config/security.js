/**
 * Configuración de seguridad para la aplicación
 * Incluye Helmet, CORS, Rate Limiting y otras configuraciones de seguridad
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

/**
 * Configuración de Helmet para cabeceras HTTP seguras
 * Mitiga riesgos de seguridad como XSS, clickjacking, MIME sniffing, etc.
 */
const helmetConfig = helmet({
  // Previene ataques XSS mediante Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      scriptSrc: ['\'self\''],
      imgSrc: ['\'self\'', 'data:', 'https:'],
    },
  },
  // Previene clickjacking estableciendo X-Frame-Options
  frameguard: { action: 'deny' },
  // Deshabilita X-Powered-By para no exponer información del servidor
  hidePoweredBy: true,
  // Previene MIME type sniffing
  noSniff: true,
  // Establece XSS Protection
  xssFilter: true,
});

/**
 * Configuración de CORS
 * En desarrollo permite todos los orígenes, en producción solo dominios específicos
 */
const corsConfig = cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-dominio.com', 'https://www.tu-dominio.com'] // Cambiar por tus dominios de producción
    : true, // En desarrollo permite todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  // Previene ataques CSRF al controlar qué dominios pueden hacer requests
});

/**
 * Rate Limiting para prevenir abuso y ataques DDoS
 * Limita a 50 requests por minuto por IP
 */
const rateLimitConfig = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 50, // máximo 50 requests por ventana de tiempo
  message: {
    error: {
      message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true, // Incluye información de rate limit en headers
  legacyHeaders: false, // Deshabilita headers legacy
  // Previene ataques de fuerza bruta y DDoS limitando la frecuencia de requests
});

/**
 * Rate limiting más estricto para endpoints de búsqueda
 * Previene abuso en operaciones costosas
 */
const searchRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // máximo 20 búsquedas por minuto
  message: {
    error: {
      message: 'Límite de búsquedas excedido, intenta de nuevo más tarde',
      code: 'SEARCH_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Middleware para logging de requests
 * Ayuda en debugging y monitoreo de seguridad
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

/**
 * Middleware para validar que el request viene de un origen válido
 * Previene ataques de origen cruzado maliciosos
 */
const validateOrigin = (req, res, next) => {
  // En desarrollo, permitir todos los orígenes
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  const origin = req.get('Origin');
  const allowedOrigins = ['https://tu-dominio.com', 'https://www.tu-dominio.com'];

  if (!origin || allowedOrigins.includes(origin)) {
    next();
  } else {
    res.status(403).json({
      error: {
        message: 'Origen no autorizado',
        code: 'INVALID_ORIGIN'
      }
    });
  }
};

module.exports = {
  helmetConfig,
  corsConfig,
  rateLimitConfig,
  searchRateLimit,
  requestLogger,
  validateOrigin
};
