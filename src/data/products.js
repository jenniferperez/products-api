/**
 * Datos de ejemplo para productos
 * Simula una base de datos con productos de diferentes categorías
 */

const {
  searchProducts: searchProductsUtil,
  paginateProducts,
  getProductsByIds: getProductsByIdsUtil,
  getProductById: getProductByIdUtil
} = require('../utils');

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    price: 999.99,
    description: 'El iPhone más avanzado con chip A17 Pro y cámara de 48MP',
    image_url: 'https://example.com/images/iphone15pro.jpg',
    rating: 4.8,
    specs: {
      'Pantalla': '6.1 pulgadas Super Retina XDR',
      'Procesador': 'A17 Pro',
      'Cámara': '48MP principal + 12MP ultra gran angular',
      'Almacenamiento': '128GB/256GB/512GB/1TB',
      'Batería': 'Hasta 23 horas de reproducción de video'
    }
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    price: 1199.99,
    description: 'Laptop ultradelgada con chip M2 y pantalla Liquid Retina de 13.6 pulgadas',
    image_url: 'https://example.com/images/macbook-air-m2.jpg',
    rating: 4.7,
    specs: {
      'Pantalla': '13.6 pulgadas Liquid Retina',
      'Procesador': 'Apple M2',
      'Memoria': '8GB/16GB/24GB RAM unificada',
      'Almacenamiento': '256GB/512GB/1TB/2TB SSD',
      'Batería': 'Hasta 18 horas de duración'
    }
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299.99,
    description: 'Smartphone premium con S Pen y cámara de 200MP',
    image_url: 'https://example.com/images/galaxy-s24-ultra.jpg',
    rating: 4.6,
    specs: {
      'Pantalla': '6.8 pulgadas Dynamic AMOLED 2X',
      'Procesador': 'Snapdragon 8 Gen 3',
      'Cámara': '200MP principal + 50MP periscope + 10MP teleobjetivo',
      'Almacenamiento': '256GB/512GB/1TB',
      'Batería': '5000mAh con carga rápida de 45W'
    }
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    price: 399.99,
    description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria',
    image_url: 'https://example.com/images/sony-wh1000xm5.jpg',
    rating: 4.9,
    specs: {
      'Tipo': 'Supraaurales inalámbricos',
      'Cancelación de ruido': 'Sí, con procesador V1',
      'Autonomía': 'Hasta 30 horas',
      'Conexión': 'Bluetooth 5.2, NFC',
      'Micrófono': '8 micrófonos para llamadas claras'
    }
  },
  {
    id: 5,
    name: 'iPad Pro 12.9',
    price: 1099.99,
    description: 'Tablet profesional con chip M2 y pantalla Liquid Retina XDR',
    image_url: 'https://example.com/images/ipad-pro-12-9.jpg',
    rating: 4.8,
    specs: {
      'Pantalla': '12.9 pulgadas Liquid Retina XDR',
      'Procesador': 'Apple M2',
      'Cámara': '12MP gran angular + 10MP ultra gran angular',
      'Almacenamiento': '128GB/256GB/512GB/1TB/2TB',
      'Conexión': 'USB-C con Thunderbolt 4'
    }
  },
  {
    id: 6,
    name: 'Dell XPS 13',
    price: 999.99,
    description: 'Laptop ultrabook con pantalla InfinityEdge y procesador Intel Core i7',
    image_url: 'https://example.com/images/dell-xps-13.jpg',
    rating: 4.5,
    specs: {
      'Pantalla': '13.4 pulgadas FHD+ InfinityEdge',
      'Procesador': 'Intel Core i7-1360P',
      'Memoria': '16GB LPDDR5',
      'Almacenamiento': '512GB SSD PCIe',
      'Batería': 'Hasta 12 horas de duración'
    }
  },
  {
    id: 7,
    name: 'AirPods Pro 2',
    price: 249.99,
    description: 'Auriculares inalámbricos con cancelación de ruido adaptativa',
    image_url: 'https://example.com/images/airpods-pro-2.jpg',
    rating: 4.7,
    specs: {
      'Tipo': 'Intraaurales inalámbricos',
      'Cancelación de ruido': 'Adaptativa con chip H2',
      'Autonomía': 'Hasta 6 horas + 24 horas con estuche',
      'Conexión': 'Bluetooth 5.3',
      'Resistencia': 'IPX4 contra sudor y agua'
    }
  },
  {
    id: 8,
    name: 'Nintendo Switch OLED',
    price: 349.99,
    description: 'Consola híbrida con pantalla OLED de 7 pulgadas',
    image_url: 'https://example.com/images/nintendo-switch-oled.jpg',
    rating: 4.6,
    specs: {
      'Pantalla': '7 pulgadas OLED',
      'Modos': 'TV, sobremesa y portátil',
      'Almacenamiento': '64GB (expandible con microSD)',
      'Batería': '4.5-9 horas según el juego',
      'Joy-Con': 'Incluye Joy-Con izquierdo y derecho'
    }
  },
  {
    id: 9,
    name: 'PlayStation 5',
    price: 499.99,
    description: 'Consola de videojuegos de nueva generación con SSD ultrarrápido',
    image_url: 'https://example.com/images/playstation-5.jpg',
    rating: 4.8,
    specs: {
      'Procesador': 'AMD Zen 2 personalizado',
      'GPU': 'AMD RDNA 2 personalizada',
      'Almacenamiento': '825GB SSD NVMe',
      'Resolución': 'Hasta 4K a 120fps',
      'Ray Tracing': 'Soporte completo'
    }
  },
  {
    id: 10,
    name: 'Apple Watch Series 9',
    price: 399.99,
    description: 'Reloj inteligente con chip S9 y pantalla Always-On Retina',
    image_url: 'https://example.com/images/apple-watch-series-9.jpg',
    rating: 4.7,
    specs: {
      'Pantalla': '45mm Always-On Retina',
      'Procesador': 'S9 SiP',
      'Resistencia': 'WR50 (hasta 50 metros)',
      'Batería': 'Hasta 18 horas de duración',
      'Sensores': 'ECG, oxígeno en sangre, temperatura'
    }
  }
];

/**
 * Función para obtener todos los productos
 * @returns {Array} Lista de todos los productos
 */
const getAllProducts = () => {
  return products;
};

/**
 * Función para obtener un producto por ID
 * @param {number} id - ID del producto
 * @returns {Object|null} Producto encontrado o null si no existe
 */
const getProductById = (id) => {
  return getProductByIdUtil(products, id);
};

/**
 * Función para obtener múltiples productos por IDs
 * @param {Array} ids - Array de IDs de productos
 * @returns {Array} Lista de productos encontrados
 */
const getProductsByIds = (ids) => {
  return getProductsByIdsUtil(products, ids);
};

/**
 * Función para buscar productos por nombre o descripción
 * @param {string} query - Término de búsqueda
 * @returns {Array} Lista de productos que coinciden con la búsqueda
 */
const searchProducts = (query) => {
  return searchProductsUtil(products, query);
};

/**
 * Función para obtener productos paginados
 * @param {number} page - Número de página (empezando en 1)
 * @param {number} limit - Cantidad de productos por página
 * @param {string} query - Término de búsqueda opcional
 * @returns {Object} Objeto con productos paginados y metadatos
 */
const getPaginatedProducts = (page, limit, query = '') => {
  return paginateProducts(products, page, limit, query);
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByIds,
  searchProducts,
  getPaginatedProducts
};
