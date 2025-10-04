/**
 * Utilidades para cálculos y transformaciones de datos
 * Proporciona funciones para estadísticas, filtros y búsquedas
 */

/**
 * Función para calcular estadísticas de productos
 * @param {Array} products - Array de productos
 * @returns {Object} Estadísticas calculadas
 */
const calculateProductStats = (products) => {
  if (!products || products.length === 0) {
    return {
      total: 0,
      averagePrice: 0,
      averageRating: 0,
      priceRange: { min: 0, max: 0 },
      ratingRange: { min: 0, max: 0 }
    };
  }

  const prices = products.map(p => p.price);
  const ratings = products.map(p => p.rating);

  return {
    total: products.length,
    averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    averageRating: ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    },
    ratingRange: {
      min: Math.min(...ratings),
      max: Math.max(...ratings)
    }
  };
};

/**
 * Función para filtrar productos por rango de precio
 * @param {Array} products - Array de productos
 * @param {number} minPrice - Precio mínimo
 * @param {number} maxPrice - Precio máximo
 * @returns {Array} Productos filtrados
 */
const filterProductsByPriceRange = (products, minPrice, maxPrice) => {
  return products.filter(product =>
    product.price >= minPrice && product.price <= maxPrice
  );
};

/**
 * Función para filtrar productos por rating mínimo
 * @param {Array} products - Array de productos
 * @param {number} minRating - Rating mínimo
 * @returns {Array} Productos filtrados
 */
const filterProductsByRating = (products, minRating) => {
  return products.filter(product => product.rating >= minRating);
};

/**
 * Función para buscar productos por término de búsqueda
 * @param {Array} products - Array de productos
 * @param {string} query - Término de búsqueda
 * @returns {Array} Productos que coinciden
 */
const searchProducts = (products, query) => {
  if (!query || query.trim() === '') {
    return [];
  }
  const searchTerm = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm)
  );
};

/**
 * Función para buscar productos por especificaciones
 * @param {Array} products - Array de productos
 * @param {string} spec - Especificación a buscar
 * @returns {Array} Productos que contienen la especificación
 */
const searchProductsBySpecification = (products, spec) => {
  if (!spec || spec.trim() === '') {
    return [];
  }
  const searchTerm = spec.toLowerCase();
  return products.filter(product => {
    return Object.values(product.specs).some(value =>
      value.toLowerCase().includes(searchTerm)
    );
  });
};

/**
 * Función para obtener productos paginados
 * @param {Array} products - Array de productos
 * @param {number} page - Número de página (empezando en 1)
 * @param {number} limit - Cantidad de productos por página
 * @param {string} query - Término de búsqueda opcional
 * @returns {Object} Objeto con productos paginados y metadatos
 */
const paginateProducts = (products, page, limit, query = '') => {
  let filteredProducts = products;

  // Si hay término de búsqueda, filtrar productos
  if (query) {
    filteredProducts = searchProducts(products, query);
  }

  // Calcular paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
      hasNext: endIndex < filteredProducts.length,
      hasPrev: page > 1
    }
  };
};

/**
 * Función para obtener productos por IDs
 * @param {Array} products - Array de productos
 * @param {Array} ids - Array de IDs
 * @returns {Array} Productos encontrados
 */
const getProductsByIds = (products, ids) => {
  const numericIds = ids.map(id => parseInt(id));
  return products.filter(product => numericIds.includes(product.id));
};

/**
 * Función para obtener un producto por ID
 * @param {Array} products - Array de productos
 * @param {number|string} id - ID del producto
 * @returns {Object|null} Producto encontrado o null
 */
const getProductById = (products, id) => {
  return products.find(product => product.id === parseInt(id)) || null;
};

module.exports = {
  calculateProductStats,
  filterProductsByPriceRange,
  filterProductsByRating,
  searchProducts,
  searchProductsBySpecification,
  paginateProducts,
  getProductsByIds,
  getProductById
};
