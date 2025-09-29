/**
 * Datos de prueba para tests
 * Fixtures y mocks para testing
 */

// Productos de prueba
const testProducts = [
  {
    id: 1,
    name: 'Test iPhone',
    price: 999.99,
    description: 'Test iPhone description',
    image_url: 'https://example.com/iphone.jpg',
    rating: 4.8,
    specs: {
      'Pantalla': '6.1 pulgadas',
      'Procesador': 'A17 Pro',
      'Cámara': '48MP'
    }
  },
  {
    id: 2,
    name: 'Test MacBook',
    price: 1199.99,
    description: 'Test MacBook description',
    image_url: 'https://example.com/macbook.jpg',
    rating: 4.7,
    specs: {
      'Pantalla': '13.6 pulgadas',
      'Procesador': 'M2',
      'Memoria': '8GB'
    }
  },
  {
    id: 3,
    name: 'Test AirPods',
    price: 249.99,
    description: 'Test AirPods description',
    image_url: 'https://example.com/airpods.jpg',
    rating: 4.6,
    specs: {
      'Tipo': 'Inalámbricos',
      'Autonomía': '6 horas',
      'Conexión': 'Bluetooth 5.3'
    }
  }
];

// Errores de prueba
const testErrors = {
  validation: {
    message: 'Validation error',
    code: 'VALIDATION_ERROR',
    statusCode: 400
  },
  notFound: {
    message: 'Product not found',
    code: 'PRODUCT_NOT_FOUND',
    statusCode: 404
  },
  rateLimit: {
    message: 'Rate limit exceeded',
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429
  }
};

// Parámetros de prueba
const testParams = {
  pagination: {
    valid: { page: 1, limit: 10 },
    invalid: { page: 0, limit: 101 },
    edge: { page: 1000, limit: 1 }
  },
  price: {
    valid: { minPrice: 100, maxPrice: 500 },
    invalid: { minPrice: -1, maxPrice: 1000001 },
    edge: { minPrice: 0, maxPrice: 1000000 }
  },
  rating: {
    valid: { minRating: 4.0 },
    invalid: { minRating: -1 },
    edge: { minRating: 5.0 }
  },
  search: {
    valid: { query: 'iPhone' },
    invalid: { query: 'a'.repeat(101) },
    empty: { query: '' }
  }
};

// Respuestas de prueba
const testResponses = {
  success: {
    success: true,
    data: testProducts[0],
    pagination: {
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  },
  error: {
    error: {
      message: 'Test error message',
      code: 'TEST_ERROR'
    }
  },
  stats: {
    total: 3,
    averagePrice: 816.66,
    averageRating: 4.7,
    priceRange: {
      min: 249.99,
      max: 1199.99
    },
    ratingRange: {
      min: 4.6,
      max: 4.8
    }
  }
};

// Mocks para funciones
const mockFunctions = {
  getAllProducts: jest.fn(() => testProducts),
  getProductById: jest.fn((id) => testProducts.find(p => p.id === id)),
  getProductsByIds: jest.fn((ids) => testProducts.filter(p => ids.includes(p.id))),
  searchProducts: jest.fn((query) => 
    testProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
  ),
  getPaginatedProducts: jest.fn((page, limit, query) => ({
    products: testProducts.slice(0, limit),
    pagination: {
      page,
      limit,
      total: testProducts.length,
      totalPages: Math.ceil(testProducts.length / limit),
      hasNext: false,
      hasPrev: false
    }
  }))
};

module.exports = {
  testProducts,
  testErrors,
  testParams,
  testResponses,
  mockFunctions
};
