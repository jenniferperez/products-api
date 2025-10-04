/**
 * Configuración de Swagger para documentación de la API
 * Genera documentación automática basada en comentarios JSDoc
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Configuración base de Swagger
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
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
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://tu-api.com' // Cambiar por tu URL de producción
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production'
          ? 'Servidor de producción'
          : 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Products',
        description: 'Endpoints para gestión de productos'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key para autenticación (opcional)'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        RateLimitError: {
          description: 'Límite de velocidad excedido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js', // Archivos de rutas con documentación Swagger
    './src/app.js' // Archivo principal con configuración adicional
  ],
  // Configuración para generar documentación en src/docs
  output: './src/docs/swagger.json'
};

// Generar especificación de Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Middleware para servir la documentación de Swagger
 * @param {Object} app - Instancia de Express
 */
const setupSwagger = (app) => {
  // Guardar especificación en src/docs
  const fs = require('fs');
  const path = require('path');

  try {
    const docsDir = path.join(__dirname, '../docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const swaggerJsonPath = path.join(docsDir, 'swagger.json');
    fs.writeFileSync(swaggerJsonPath, JSON.stringify(swaggerSpec, null, 2));
    console.log('📄 Documentación Swagger guardada en:', swaggerJsonPath);
  } catch (error) {
    console.warn('⚠️ No se pudo guardar swagger.json:', error.message);
  }

  // Servir la documentación de Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { 
        background-color: #2c3e50; 
      }
      .swagger-ui .topbar .download-url-wrapper .download-url-button {
        background-color: #3498db;
      }
    `,
    customSiteTitle: 'Products API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true
    }
  }));

  // Endpoint para obtener la especificación JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Documentación de Swagger disponible en: http://localhost:3000/api-docs');
};

/**
 * Función para agregar ejemplos de respuestas a la documentación
 * @param {Object} schema - Esquema de Swagger
 * @param {Object} examples - Ejemplos de respuestas
 * @returns {Object} Esquema con ejemplos
 */
const addResponseExamples = (schema, examples) => {
  if (!schema.content) {
    schema.content = {};
  }

  if (!schema.content['application/json']) {
    schema.content['application/json'] = {};
  }

  schema.content['application/json'].examples = examples;
  return schema;
};

/**
 * Configuración adicional para Swagger en desarrollo
 */
if (process.env.NODE_ENV === 'development') {
  // Agregar información adicional para desarrollo
  swaggerOptions.definition.info.description += `
  
  ## Características de Seguridad Implementadas:
  
  - **Helmet**: Cabeceras HTTP seguras para prevenir XSS, clickjacking, etc.
  - **CORS**: Control de acceso de origen cruzado configurado por ambiente
  - **Rate Limiting**: Límite de 50 requests/minuto para prevenir abuso
  - **Validación Joi**: Validación robusta de entrada para prevenir inyección
  - **Sanitización**: Limpieza de inputs para prevenir ataques XSS
  - **Manejo de Errores**: Respuestas consistentes sin exposición de información sensible
  
  ## Endpoints Disponibles:
  
  - \`GET /api/products\` - Lista paginada de productos
  - \`GET /api/products/:id\` - Detalle de un producto
  - \`GET /api/products/bulk\` - Múltiples productos por IDs
  - \`GET /api/products/stats\` - Estadísticas de productos
  - \`GET /api/products/search/price\` - Búsqueda por rango de precio
  - \`GET /api/products/search/rating\` - Búsqueda por rating mínimo
  - \`GET /api/products/search/specs\` - Búsqueda por especificaciones
  `;
}

module.exports = {
  setupSwagger,
  swaggerSpec,
  addResponseExamples
};
