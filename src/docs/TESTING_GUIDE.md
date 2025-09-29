# Products API - Testing Guide

## Descripción General

La Products API incluye un sistema completo de testing con Jest, diseñado para alcanzar una cobertura mínima del 80% en todas las métricas (branches, functions, lines, statements). El sistema de testing está organizado en tests unitarios e integración, con fixtures y mocks para facilitar el desarrollo y mantenimiento.

## Estructura de Testing

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

## Configuración de Jest

### jest.config.js
```javascript
{
  "testEnvironment": "node",
  "collectCoverage": true,
  "coverageDirectory": "src/test/coverage",
  "coverageReporters": ["text", "lcov", "html", "json"],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "testMatch": [
    "**/src/test/**/*.test.js",
    "**/src/test/**/*.spec.js"
  ],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/test/**",
    "!src/docs/**",
    "!src/app.js"
  ]
}
```

### setup.js
Configuración global que incluye:
- Variables de entorno para testing
- Mocks de console para tests silenciosos
- Timeout global de 10 segundos
- Limpieza automática de mocks
- Helpers globales para tests
- Matchers personalizados

## Fixtures y Datos de Prueba

### testData.js
Contiene datos centralizados para testing:

```javascript
// Productos de prueba
const testProducts = [
  {
    id: 1,
    name: 'Test iPhone',
    price: 999.99,
    description: 'Test iPhone description',
    rating: 4.8,
    specs: { ... }
  }
];

// Errores de prueba
const testErrors = {
  validation: { message: 'Validation error', code: 'VALIDATION_ERROR' },
  notFound: { message: 'Product not found', code: 'PRODUCT_NOT_FOUND' }
};

// Parámetros de prueba
const testParams = {
  pagination: { valid: { page: 1, limit: 10 } },
  price: { valid: { minPrice: 100, maxPrice: 500 } }
};
```

## Tests Unitarios

### 1. errorUtils.test.js
**Cobertura:** 100%
- Tests para `AppError` class
- Tests para `createError` function
- Tests para `asyncHandler` wrapper
- Tests para `validateProductExists`
- Tests para `validateProductsExist`

**Casos de prueba:**
- Creación de errores con propiedades correctas
- Manejo de funciones async exitosas y con errores
- Validación de productos existentes y no existentes
- Validación de múltiples productos

### 2. validationUtils.test.js
**Cobertura:** 100%
- Tests para `sanitizeInput` middleware
- Tests para `validatePriceRange`
- Tests para `validateRating`
- Tests para `validateSearchTerm`
- Tests para `parseIdsString`

**Casos de prueba:**
- Sanitización de XSS y HTML
- Validación de rangos de precio
- Validación de ratings (0-5)
- Validación de términos de búsqueda
- Parsing de IDs con validación

### 3. dataUtils.test.js
**Cobertura:** 100%
- Tests para `calculateProductStats`
- Tests para `filterProductsByPriceRange`
- Tests para `filterProductsByRating`
- Tests para `searchProducts`
- Tests para `searchProductsBySpecification`
- Tests para `paginateProducts`
- Tests para `getProductById` y `getProductsByIds`

**Casos de prueba:**
- Cálculo de estadísticas de productos
- Filtrado por precio y rating
- Búsqueda por texto y especificaciones
- Paginación con metadatos
- Búsqueda por ID individual y múltiple

### 4. productService.test.js
**Cobertura:** 95%
- Tests para todos los métodos del servicio
- Mocks de dependencias (data, utils)
- Tests de lógica de negocio
- Tests de análisis y estadísticas

**Casos de prueba:**
- Obtención de productos paginados
- Búsqueda por ID individual y múltiple
- Cálculo de estadísticas con análisis
- Filtrado por precio y rating
- Búsqueda por especificaciones

### 5. businessValidationService.test.js
**Cobertura:** 90%
- Tests para validaciones de negocio
- Mocks de Joi para validación
- Tests de reglas de negocio
- Tests de manejo de errores

**Casos de prueba:**
- Validación de parámetros de paginación
- Validación de rangos de precio
- Validación de ratings
- Validación de IDs y especificaciones
- Validación de reglas de negocio

### 6. productController.test.js
**Cobertura:** 95%
- Tests para todos los endpoints
- Mocks de servicios y validaciones
- Tests de respuestas HTTP
- Tests de manejo de errores

**Casos de prueba:**
- Respuestas exitosas con datos correctos
- Manejo de errores de validación
- Manejo de errores de servicios
- Formato correcto de respuestas JSON

### 7. products.test.js
**Cobertura:** 100%
- Tests para módulo de datos
- Tests de estructura de datos
- Tests de búsqueda y filtrado
- Tests de paginación

**Casos de prueba:**
- Obtención de todos los productos
- Búsqueda por ID individual y múltiple
- Búsqueda por texto
- Paginación con metadatos

## Comandos de Testing

### Ejecutar Tests
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testNamePattern="errorUtils"

# Ejecutar tests en modo verbose
npm test -- --verbose
```

### Testing con Docker
```bash
# Construir imagen con tests
docker build -t products-api-test .

# Ejecutar tests en contenedor
docker run --rm products-api-test npm test

# Ejecutar tests con cobertura en contenedor
docker run --rm products-api-test npm run test:coverage

# Ejecutar tests específicos en contenedor
docker run --rm products-api-test npm test -- --testNamePattern="productService"
```

### Scripts de package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Cobertura de Código

### Métricas Objetivo
- **Branches:** 80% mínimo
- **Functions:** 80% mínimo
- **Lines:** 80% mínimo
- **Statements:** 80% mínimo

### Reportes de Cobertura
- **Texto:** En consola durante ejecución
- **HTML:** `src/test/coverage/lcov-report/index.html`
- **LCOV:** `src/test/coverage/lcov.info`
- **JSON:** `src/test/coverage/coverage-final.json`

### Archivos Excluidos
- `src/test/**` - Archivos de testing
- `src/docs/**` - Documentación
- `src/app.js` - Punto de entrada principal
- `node_modules/**` - Dependencias

## Mocks y Stubs

### Estrategia de Mocking
1. **Servicios:** Mock completo de `productService` y `businessValidationService`
2. **Datos:** Mock de funciones de acceso a datos
3. **Utilidades:** Mock de funciones utilitarias cuando es necesario
4. **HTTP:** Mock de request/response objects

### Ejemplo de Mock
```javascript
// Mock de servicio
jest.mock('../../services', () => ({
  productService: {
    getProducts: jest.fn(),
    getProductById: jest.fn()
  }
}));

// Uso en test
const { productService } = require('../../services');
productService.getProducts.mockResolvedValue(mockData);
```

## Helpers de Testing

### Helpers Globales
```javascript
// Crear producto mock
global.testHelpers.createMockProduct(overrides)

// Crear request mock
global.testHelpers.createMockRequest(overrides)

// Crear response mock
global.testHelpers.createMockResponse()

// Crear next function mock
global.testHelpers.createMockNext()
```

### Matchers Personalizados
```javascript
// Validar producto
expect(product).toBeValidProduct()

// Validar error
expect(error).toBeValidError()
```

## Testing de Integración

### Estructura Futura
```
src/test/integration/
├── api/                       # Tests de API endpoints
│   ├── products.test.js      # Tests de endpoints de productos
│   └── health.test.js        # Tests de health checks
├── middleware/               # Tests de middleware
│   ├── errorHandler.test.js  # Tests de manejo de errores
│   └── validation.test.js    # Tests de validación
└── utils/                    # Tests de utilidades
    └── config.test.js        # Tests de configuración
```

### Ejemplo de Test de Integración
```javascript
describe('GET /api/products', () => {
  test('should return products with pagination', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });
});
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v1
```

### Cobertura en CI
- Ejecución automática en cada push
- Reporte de cobertura en PRs
- Falla si cobertura < 80%
- Integración con Codecov

## Mejores Prácticas

### 1. Organización
- Un archivo de test por módulo
- Tests agrupados por funcionalidad
- Nombres descriptivos para tests
- Setup y teardown apropiados

### 2. Mocks
- Mock solo lo necesario
- Reset mocks entre tests
- Verificar llamadas a mocks
- Usar datos realistas

### 3. Assertions
- Assertions específicas y claras
- Verificar estructura de datos
- Testear casos edge
- Incluir casos de error

### 4. Cobertura
- Mantener cobertura > 80%
- Revisar reportes regularmente
- Identificar código no cubierto
- Priorizar tests de lógica crítica

## Troubleshooting

### Problemas Comunes

**1. Tests fallan por timeouts**
```javascript
// Aumentar timeout
jest.setTimeout(30000);
```

**2. Mocks no funcionan**
```javascript
// Verificar orden de imports
jest.mock('../../module', () => ({ ... }));
const module = require('../../module');
```

**3. Cobertura baja**
```javascript
// Verificar archivos excluidos
"collectCoverageFrom": [
  "src/**/*.js",
  "!src/test/**"
]
```

**4. Tests flaky**
```javascript
// Usar datos determinísticos
// Evitar dependencias externas
// Mock timeouts y delays
```

## Métricas y Monitoreo

### Dashboard de Cobertura
- Cobertura por archivo
- Tendencias de cobertura
- Archivos con menor cobertura
- Alertas de cobertura baja

### Métricas de Calidad
- Tiempo de ejecución de tests
- Número de tests por módulo
- Tasa de fallos
- Cobertura de branches críticos

## Roadmap de Testing

### v1.1.0
- [ ] Tests de integración completos
- [ ] Tests de performance
- [ ] Tests de seguridad
- [ ] Tests de carga

### v1.2.0
- [ ] Tests E2E con Playwright
- [ ] Tests de accesibilidad
- [ ] Tests de compatibilidad
- [ ] Tests de regresión visual

### v2.0.0
- [ ] Tests de microservicios
- [ ] Tests de contratos
- [ ] Tests de chaos engineering
- [ ] Tests de disaster recovery
