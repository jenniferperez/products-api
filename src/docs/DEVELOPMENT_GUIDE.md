# Products API - Guía de Desarrollo

## Arquitectura

La API sigue una arquitectura de capas bien definida:

```
┌─────────────────┐
│   Controllers   │ ← Manejo de HTTP requests/responses
├─────────────────┤
│    Services     │ ← Lógica de negocio
├─────────────────┤
│      Utils      │ ← Funciones utilitarias
├─────────────────┤
│      Data       │ ← Acceso a datos
├─────────────────┤
│     Config      │ ← Configuraciones
└─────────────────┘
```

## Estructura de Archivos

### Controllers (`src/controllers/`)
- Manejan las requests HTTP
- Validan parámetros básicos
- Llaman a los servicios
- Formatean respuestas
- Manejan errores HTTP

### Services (`src/services/`)
- Contienen la lógica de negocio
- Validaciones específicas del dominio
- Cálculos y transformaciones
- Reglas de negocio

### Utils (`src/utils/`)
- Funciones reutilizables
- Validaciones genéricas
- Transformaciones de datos
- Cálculos matemáticos

### Data (`src/data/`)
- Acceso a datos
- Simulación de base de datos
- Operaciones CRUD básicas

### Config (`src/config/`)
- Configuraciones de la aplicación
- Configuraciones de seguridad
- Configuraciones de Swagger

### Docker
- `Dockerfile`: Configuración de la imagen Docker
- `.dockerignore`: Archivos excluidos del build
- `docker-commands.sh`: Script para construir y ejecutar
- `DOCKER_README.md`: Documentación específica de Docker

## Patrones de Diseño

### Service Layer Pattern
Los servicios encapsulan la lógica de negocio:

```javascript
// ❌ En el controlador
const products = getAllProducts();
const filtered = products.filter(p => p.price > 100);

// ✅ En el servicio
const result = await productService.getProductsByPriceRange({ min: 100 });
```

### Repository Pattern
El acceso a datos está abstraído:

```javascript
// ❌ Lógica de datos en el servicio
const products = productsData.filter(p => p.id === id);

// ✅ Usando el patrón repository
const product = await productRepository.findById(id);
```

### Error Handling Pattern
Manejo consistente de errores:

```javascript
try {
  const result = await service.method();
  res.json({ success: true, data: result });
} catch (error) {
  res.status(error.statusCode || 400).json({
    error: {
      message: error.message,
      code: error.code
    }
  });
}
```

## Convenciones de Código

### Naming Conventions

**Archivos:**
- `camelCase` para archivos JavaScript
- `kebab-case` para archivos de configuración
- `PascalCase` para clases

**Variables:**
- `camelCase` para variables y funciones
- `UPPER_CASE` para constantes
- `_private` para métodos privados

**APIs:**
- `kebab-case` para endpoints
- `snake_case` para parámetros de query

### Code Organization

**Imports:**
```javascript
// 1. Node modules
const express = require('express');
const helmet = require('helmet');

// 2. Internal modules
const { productService } = require('../services');
const { asyncHandler } = require('../utils');

// 3. Relative imports
const ProductController = require('./ProductController');
```

**Exports:**
```javascript
// Named exports para utilidades
module.exports = {
  function1,
  function2,
  ClassName
};

// Default export para clases principales
module.exports = ProductService;
```

## Validación

### Parámetros de Entrada

**En el Controlador:**
```javascript
const { page, limit } = req.query;
// Validación básica de tipos
```

**En el Servicio:**
```javascript
const validatedParams = businessValidationService.validatePaginationParams({
  page, limit
});
// Validación de reglas de negocio
```

**En Utils:**
```javascript
const sanitizedInput = sanitizeInput(input);
// Sanitización y limpieza
```

### Respuestas de Error

**Estructura estándar:**
```javascript
{
  "error": {
    "message": "Descripción del error",
    "code": "ERROR_CODE",
    "details": [
      {
        "field": "campo",
        "message": "mensaje específico"
      }
    ]
  }
}
```

## Testing

### Estructura de Tests

```
src/test/
├── setup.js                    # Configuración global de Jest
├── fixtures/                   # Datos de prueba y mocks
│   └── testData.js            # Fixtures centralizados
├── unit/                      # Tests unitarios
│   ├── errorUtils.test.js     # Tests para utilidades de error
│   ├── validationUtils.test.js # Tests para utilidades de validación
│   ├── dataUtils.test.js      # Tests para utilidades de datos
│   ├── productService.test.js # Tests para servicio de productos
│   ├── businessValidationService.test.js # Tests para validación de negocio
│   ├── productController.test.js # Tests para controlador de productos
│   └── products.test.js       # Tests para módulo de datos
├── integration/               # Tests de integración (futuro)
└── coverage/                  # Reportes de cobertura (generado)
```

### Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests específicos
npm test -- --testNamePattern="errorUtils"
```

**Cobertura mínima:** 80% en branches, functions, lines y statements
**Documentación:** Ver `src/docs/TESTING_GUIDE.md` para guía completa

### Ejemplo de Test Unitario

```javascript
describe('ProductService', () => {
  describe('getProductsByPriceRange', () => {
    it('should return products within price range', async () => {
      const result = await productService.getProductsByPriceRange({
        min: 100,
        max: 500
      });
      
      expect(result.products).toHaveLength(3);
      expect(result.count).toBe(3);
      expect(result.priceRange).toEqual({ min: 100, max: 500 });
    });
  });
});
```

## Documentación

### Swagger/OpenAPI

**Comentarios en rutas:**
```javascript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 */
```

**Esquemas:**
```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */
```

### README Files

Cada directorio debe tener un README.md explicando:
- Propósito del módulo
- Funciones principales
- Ejemplos de uso
- Dependencias

## Seguridad

### Input Validation

**Sanitización:**
```javascript
const sanitizedInput = input
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  .replace(/<[^>]*>/g, '')
  .trim();
```

**Validación:**
```javascript
if (typeof input !== 'string' || input.length > 100) {
  throw new Error('Invalid input');
}
```

### Rate Limiting

```javascript
const rateLimitConfig = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 50, // máximo 50 requests
  message: {
    error: {
      message: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});
```

## Performance

### Optimizaciones

**Paginación:**
```javascript
const startIndex = (page - 1) * limit;
const endIndex = startIndex + limit;
const paginatedData = data.slice(startIndex, endIndex);
```

**Caching:**
```javascript
// Para datos que no cambian frecuentemente
const cachedStats = cache.get('product-stats');
if (cachedStats) {
  return cachedStats;
}
```

**Lazy Loading:**
```javascript
// Cargar datos solo cuando se necesiten
const getProductDetails = async (id) => {
  if (!productDetailsCache.has(id)) {
    const details = await fetchProductDetails(id);
    productDetailsCache.set(id, details);
  }
  return productDetailsCache.get(id);
};
```

## Deployment

### Environment Variables

```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
LOG_LEVEL=info
```

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 3000
CMD ["npm", "start"]
```

### Health Checks

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## Monitoring

### Logging

```javascript
const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${message}`, meta);
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

### Metrics

```javascript
const metrics = {
  requestCount: 0,
  errorCount: 0,
  responseTime: []
};

// Middleware para métricas
app.use((req, res, next) => {
  const start = Date.now();
  metrics.requestCount++;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.responseTime.push(duration);
  });
  
  next();
});
```

## Docker Development

### Construcción y Ejecución

```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run

# Ver logs
npm run docker:logs

# Detener contenedor
npm run docker:stop
```

### Desarrollo con Docker

```bash
# Script automatizado
./docker-commands.sh

# Verificar estado
docker ps

# Acceder al contenedor
docker exec -it products-api-container sh
```

### Variables de Entorno en Docker

```bash
docker run -d \
  --name products-api-container \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  products-api
```

## Troubleshooting

### Common Issues

**Memory Leaks:**
- Verificar que no hay referencias circulares
- Limpiar event listeners
- Usar streams para archivos grandes

**Performance Issues:**
- Implementar paginación
- Usar índices en consultas
- Cachear resultados frecuentes

**Error Handling:**
- Siempre usar try-catch en operaciones async
- Logear errores con contexto
- Retornar códigos de error apropiados

**Docker Issues:**
- Verificar que el puerto 3000 esté disponible
- Revisar logs del contenedor: `docker logs products-api-container`
- Verificar que la imagen se construyó correctamente

### Debugging

```javascript
// Debug mode
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.query);
    next();
  });
}
```
