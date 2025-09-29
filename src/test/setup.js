/**
 * Configuración global para tests
 * Setup inicial para Jest
 */

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

// Mock de console para tests silenciosos
global.console = {
  ...console,
  // Mantener console.error para ver errores reales
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

// Timeout global para tests
jest.setTimeout(10000);

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Configuración global de expect
expect.extend({
  toBeValidProduct(received) {
    const pass = received &&
      typeof received.id === 'number' &&
      typeof received.name === 'string' &&
      typeof received.price === 'number' &&
      typeof received.description === 'string' &&
      typeof received.rating === 'number' &&
      received.rating >= 0 &&
      received.rating <= 5;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid product`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid product`,
        pass: false,
      };
    }
  },

  toBeValidError(received) {
    const pass = received &&
      typeof received.message === 'string' &&
      typeof received.code === 'string';

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid error`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid error`,
        pass: false,
      };
    }
  }
});

// Helpers globales para tests
global.testHelpers = {
  createMockProduct: (overrides = {}) => ({
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'Test product description',
    image_url: 'https://example.com/test.jpg',
    rating: 4.5,
    specs: {
      'Test Spec': 'Test Value'
    },
    ...overrides
  }),

  createMockRequest: (overrides = {}) => ({
    params: {},
    query: {},
    body: {},
    ...overrides
  }),

  createMockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },

  createMockNext: () => jest.fn()
};
