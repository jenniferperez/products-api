/**
 * Servicio de Productos
 * Contiene toda la lógica de negocio relacionada con productos
 */

const { getAllProducts, getProductById, getProductsByIds, getPaginatedProducts } = require('../data/products');
const {
  calculateProductStats,
  filterProductsByPriceRange,
  filterProductsByRating,
  searchProductsBySpecification,
  validatePriceRange,
  validateRating,
  validateSearchTerm,
  parseIdsString,
  validateProductExists,
  validateProductsExist
} = require('../utils');

/**
 * Clase ProductService - Maneja toda la lógica de negocio de productos
 */
class ProductService {
  /**
   * Obtiene productos paginados con búsqueda opcional
   * @param {Object} params - Parámetros de paginación y búsqueda
   * @param {number} params.page - Número de página
   * @param {number} params.limit - Cantidad por página
   * @param {string} params.query - Término de búsqueda opcional
   * @returns {Object} Resultado con productos y metadatos de paginación
   */
  async getProducts(params = {}) {
    const { page = 1, limit = 10, query = '' } = params;
    
    // Validar parámetros de paginación
    if (page < 1) {
      throw new Error('El número de página debe ser mayor a 0');
    }
    
    if (limit < 1 || limit > 100) {
      throw new Error('El límite debe estar entre 1 y 100');
    }
    
    // Obtener productos paginados
    const result = getPaginatedProducts(page, limit, query);
    
    return {
      products: result.products,
      pagination: result.pagination,
      searchTerm: query
    };
  }

  /**
   * Obtiene un producto por ID con validación de negocio
   * @param {number|string} id - ID del producto
   * @returns {Object} Producto encontrado
   * @throws {Error} Si el producto no existe
   */
  async getProductById(id) {
    // Validar que el producto existe
    const product = validateProductExists(id, getProductById);
    
    return {
      product,
      found: true
    };
  }

  /**
   * Obtiene múltiples productos por IDs con validación de negocio
   * @param {string} idsString - String de IDs separados por comas
   * @returns {Object} Productos encontrados con metadatos
   * @throws {Error} Si algún producto no existe
   */
  async getBulkProducts(idsString) {
    // Convertir string de IDs a array
    const idsArray = parseIdsString(idsString);
    
    // Validar que todos los productos existen
    const products = validateProductsExist(idsArray, getProductsByIds);
    
    return {
      products,
      count: products.length,
      requestedIds: idsArray,
      foundIds: products.map(p => p.id)
    };
  }

  /**
   * Calcula estadísticas de productos con lógica de negocio
   * @returns {Object} Estadísticas calculadas
   */
  async getProductStats() {
    const products = getAllProducts();
    
    // Calcular estadísticas usando utilidad
    const stats = calculateProductStats(products);
    
    // Agregar lógica de negocio adicional
    const enhancedStats = {
      ...stats,
      categories: this._analyzeCategories(products),
      priceSegments: this._analyzePriceSegments(products),
      ratingDistribution: this._analyzeRatingDistribution(products),
      lastUpdated: new Date().toISOString()
    };
    
    return enhancedStats;
  }

  /**
   * Obtiene productos por rango de precio con validación de negocio
   * @param {Object} params - Parámetros de precio
   * @param {number|string} params.minPrice - Precio mínimo
   * @param {number|string} params.maxPrice - Precio máximo
   * @returns {Object} Productos filtrados con metadatos
   * @throws {Error} Si los parámetros son inválidos
   */
  async getProductsByPriceRange(params) {
    const { minPrice, maxPrice } = params;
    
    // Validar parámetros de precio
    const { min, max } = validatePriceRange(minPrice, maxPrice);
    
    const products = getAllProducts();
    
    // Filtrar productos
    const filteredProducts = filterProductsByPriceRange(products, min, max);
    
    // Agregar análisis de negocio
    const analysis = this._analyzePriceRangeResults(filteredProducts, min, max);
    
    return {
      products: filteredProducts,
      count: filteredProducts.length,
      priceRange: { min, max },
      analysis
    };
  }

  /**
   * Obtiene productos por rating mínimo con validación de negocio
   * @param {Object} params - Parámetros de rating
   * @param {number|string} params.minRating - Rating mínimo
   * @returns {Object} Productos filtrados con metadatos
   * @throws {Error} Si el parámetro es inválido
   */
  async getProductsByRating(params) {
    const { minRating } = params;
    
    // Validar parámetro de rating
    const min = validateRating(minRating);
    
    const products = getAllProducts();
    
    // Filtrar productos
    const filteredProducts = filterProductsByRating(products, min);
    
    // Agregar análisis de negocio
    const analysis = this._analyzeRatingResults(filteredProducts, min);
    
    return {
      products: filteredProducts,
      count: filteredProducts.length,
      minRating: min,
      analysis
    };
  }

  /**
   * Busca productos por especificaciones con validación de negocio
   * @param {Object} params - Parámetros de búsqueda
   * @param {string} params.spec - Especificación a buscar
   * @returns {Object} Productos encontrados con metadatos
   * @throws {Error} Si el parámetro es inválido
   */
  async searchProductsBySpecification(params) {
    const { spec } = params;
    
    // Validar término de búsqueda
    const searchTerm = validateSearchTerm(spec);
    
    const products = getAllProducts();
    
    // Buscar productos
    const filteredProducts = searchProductsBySpecification(products, searchTerm);
    
    // Agregar análisis de búsqueda
    const analysis = this._analyzeSearchResults(filteredProducts, searchTerm);
    
    return {
      products: filteredProducts,
      count: filteredProducts.length,
      searchTerm,
      analysis
    };
  }

  /**
   * Analiza categorías de productos (lógica de negocio)
   * @private
   * @param {Array} products - Lista de productos
   * @returns {Object} Análisis de categorías
   */
  _analyzeCategories(products) {
    const categories = {};
    
    products.forEach(product => {
      // Determinar categoría basada en el nombre del producto
      let category = 'Otros';
      
      if (product.name.toLowerCase().includes('iphone') || 
          product.name.toLowerCase().includes('galaxy')) {
        category = 'Smartphones';
      } else if (product.name.toLowerCase().includes('macbook') || 
                 product.name.toLowerCase().includes('dell')) {
        category = 'Laptops';
      } else if (product.name.toLowerCase().includes('ipad')) {
        category = 'Tablets';
      } else if (product.name.toLowerCase().includes('airpods') || 
                 product.name.toLowerCase().includes('sony')) {
        category = 'Audio';
      } else if (product.name.toLowerCase().includes('nintendo') || 
                 product.name.toLowerCase().includes('playstation')) {
        category = 'Gaming';
      } else if (product.name.toLowerCase().includes('apple watch')) {
        category = 'Wearables';
      }
      
      if (!categories[category]) {
        categories[category] = {
          count: 0,
          averagePrice: 0,
          averageRating: 0,
          products: []
        };
      }
      
      categories[category].count++;
      categories[category].products.push(product);
    });
    
    // Calcular promedios por categoría
    Object.keys(categories).forEach(category => {
      const catProducts = categories[category].products;
      categories[category].averagePrice = 
        catProducts.reduce((sum, p) => sum + p.price, 0) / catProducts.length;
      categories[category].averageRating = 
        catProducts.reduce((sum, p) => sum + p.rating, 0) / catProducts.length;
    });
    
    return categories;
  }

  /**
   * Analiza segmentos de precio (lógica de negocio)
   * @private
   * @param {Array} products - Lista de productos
   * @returns {Object} Análisis de segmentos de precio
   */
  _analyzePriceSegments(products) {
    const segments = {
      budget: { min: 0, max: 300, count: 0, products: [] },
      midRange: { min: 300, max: 800, count: 0, products: [] },
      premium: { min: 800, max: 1200, count: 0, products: [] },
      luxury: { min: 1200, max: Infinity, count: 0, products: [] }
    };
    
    products.forEach(product => {
      if (product.price < 300) {
        segments.budget.count++;
        segments.budget.products.push(product);
      } else if (product.price < 800) {
        segments.midRange.count++;
        segments.midRange.products.push(product);
      } else if (product.price < 1200) {
        segments.premium.count++;
        segments.premium.products.push(product);
      } else {
        segments.luxury.count++;
        segments.luxury.products.push(product);
      }
    });
    
    return segments;
  }

  /**
   * Analiza distribución de ratings (lógica de negocio)
   * @private
   * @param {Array} products - Lista de productos
   * @returns {Object} Análisis de distribución de ratings
   */
  _analyzeRatingDistribution(products) {
    const distribution = {
      excellent: { min: 4.5, max: 5.0, count: 0, percentage: 0 },
      good: { min: 4.0, max: 4.5, count: 0, percentage: 0 },
      average: { min: 3.0, max: 4.0, count: 0, percentage: 0 },
      poor: { min: 0, max: 3.0, count: 0, percentage: 0 }
    };
    
    products.forEach(product => {
      if (product.rating >= 4.5) {
        distribution.excellent.count++;
      } else if (product.rating >= 4.0) {
        distribution.good.count++;
      } else if (product.rating >= 3.0) {
        distribution.average.count++;
      } else {
        distribution.poor.count++;
      }
    });
    
    // Calcular porcentajes
    const total = products.length;
    Object.keys(distribution).forEach(key => {
      distribution[key].percentage = (distribution[key].count / total) * 100;
    });
    
    return distribution;
  }

  /**
   * Analiza resultados de búsqueda por rango de precio
   * @private
   * @param {Array} products - Productos filtrados
   * @param {number} min - Precio mínimo
   * @param {number} max - Precio máximo
   * @returns {Object} Análisis de resultados
   */
  _analyzePriceRangeResults(products, min, max) {
    if (products.length === 0) {
      return {
        message: 'No se encontraron productos en el rango especificado',
        suggestions: [
          'Intenta ampliar el rango de precios',
          'Verifica que los valores sean correctos'
        ]
      };
    }
    
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    
    return {
      averagePrice: avgPrice,
      averageRating: avgRating,
      priceRangeUtilization: ((max - min) / (max - min)) * 100,
      bestValue: products.reduce((best, current) => 
        (current.rating / current.price) > (best.rating / best.price) ? current : best
      )
    };
  }

  /**
   * Analiza resultados de búsqueda por rating
   * @private
   * @param {Array} products - Productos filtrados
   * @param {number} minRating - Rating mínimo
   * @returns {Object} Análisis de resultados
   */
  _analyzeRatingResults(products, minRating) {
    if (products.length === 0) {
      return {
        message: 'No se encontraron productos con el rating especificado',
        suggestions: [
          'Intenta reducir el rating mínimo',
          'Verifica que el valor esté entre 0 y 5'
        ]
      };
    }
    
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    
    return {
      averagePrice: avgPrice,
      averageRating: avgRating,
      ratingDistribution: this._analyzeRatingDistribution(products),
      topRated: products.sort((a, b) => b.rating - a.rating).slice(0, 3)
    };
  }

  /**
   * Analiza resultados de búsqueda por especificaciones
   * @private
   * @param {Array} products - Productos encontrados
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Object} Análisis de resultados
   */
  _analyzeSearchResults(products, searchTerm) {
    if (products.length === 0) {
      return {
        message: 'No se encontraron productos con la especificación especificada',
        suggestions: [
          'Intenta con términos más generales',
          'Verifica la ortografía del término de búsqueda'
        ]
      };
    }
    
    const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    
    // Encontrar especificaciones más comunes
    const specCounts = {};
    products.forEach(product => {
      Object.keys(product.specs).forEach(spec => {
        if (product.specs[spec].toLowerCase().includes(searchTerm.toLowerCase())) {
          specCounts[spec] = (specCounts[spec] || 0) + 1;
        }
      });
    });
    
    return {
      averagePrice: avgPrice,
      averageRating: avgRating,
      commonSpecifications: Object.entries(specCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([spec, count]) => ({ specification: spec, count })),
      relatedProducts: products.slice(0, 3)
    };
  }
}

// Crear instancia singleton del servicio
const productService = new ProductService();

module.exports = {
  ProductService,
  productService
};
