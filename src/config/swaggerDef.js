/**
 * Configuración para Swagger JSDoc
 * Archivo de configuración separado para generar documentación estática
 */

module.exports = {
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
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Mensaje de error descriptivo'
                },
                code: {
                  type: 'string',
                  description: 'Código de error específico'
                },
                details: {
                  type: 'array',
                  description: 'Detalles adicionales del error',
                  items: {
                    type: 'object',
                    properties: {
                      field: {
                        type: 'string'
                      },
                      message: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del producto'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto'
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Precio del producto'
            },
            description: {
              type: 'string',
              description: 'Descripción del producto'
            },
            image_url: {
              type: 'string',
              format: 'uri',
              description: 'URL de la imagen del producto'
            },
            rating: {
              type: 'number',
              format: 'float',
              minimum: 0,
              maximum: 5,
              description: 'Rating del producto (0-5)'
            },
            specs: {
              type: 'object',
              description: 'Especificaciones técnicas del producto',
              additionalProperties: {
                type: 'string'
              }
            }
          }
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Número de página actual'
            },
            limit: {
              type: 'integer',
              description: 'Cantidad de elementos por página'
            },
            total: {
              type: 'integer',
              description: 'Total de elementos'
            },
            totalPages: {
              type: 'integer',
              description: 'Total de páginas'
            },
            hasNext: {
              type: 'boolean',
              description: 'Indica si hay página siguiente'
            },
            hasPrev: {
              type: 'boolean',
              description: 'Indica si hay página anterior'
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
  }
};
