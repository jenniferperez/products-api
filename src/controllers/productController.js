const { asyncHandler } = require('../utils');
const {
  productService,
  businessValidationService
} = require('../services');

/**
 * Controlador para obtener lista paginada de productos
 * @param {Object} req - Request object con query params: page, limit, q
 * @param {Object} res - Response object
 * @returns {Object} Lista paginada de productos con metadatos
 */
const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, q } = req.query;

  try {
    // Validar parámetros usando servicio de validación de negocio
    const validatedPagination = businessValidationService.validatePaginationParams({ page, limit });
    const validatedSearch = businessValidationService.validateSearchParams({ query: q });

    // Obtener productos usando servicio de productos
    const result = await productService.getProducts({
      ...validatedPagination,
      ...validatedSearch
    });

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      searchTerm: result.searchTerm
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: {
        message: error.message,
        code: error.code || 'VALIDATION_ERROR'
      }
    });
  }
});

/**
 * Controlador para obtener un producto por ID
 * @param {Object} req - Request object con param: id
 * @param {Object} res - Response object
 * @returns {Object} Detalle del producto
 */
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener producto usando servicio de productos
    const result = await productService.getProductById(id);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: result.product,
      found: result.found
    });
  } catch (error) {
    res.status(error.statusCode || 404).json({
      error: {
        message: error.message,
        code: error.code || 'PRODUCT_NOT_FOUND'
      }
    });
  }
});

/**
 * Controlador para obtener múltiples productos por IDs
 * @param {Object} req - Request object con query param: ids
 * @param {Object} res - Response object
 * @returns {Object} Lista de productos solicitados
 */
const getBulkProducts = asyncHandler(async (req, res) => {
  const { ids } = req.query;

  try {
    // Validar parámetros usando servicio de validación de negocio
    businessValidationService.validateIdsParams({ ids });

    // Obtener productos usando servicio de productos
    const result = await productService.getBulkProducts(ids);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: result.products,
      count: result.count,
      requestedIds: result.requestedIds,
      foundIds: result.foundIds
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: {
        message: error.message,
        code: error.code || 'VALIDATION_ERROR'
      }
    });
  }
});

/**
 * Controlador para obtener estadísticas de productos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Estadísticas de productos
 */
const getProductStats = asyncHandler(async (req, res) => {
  try {
    // Obtener estadísticas usando servicio de productos
    const stats = await productService.getProductStats();

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: {
        message: error.message,
        code: error.code || 'INTERNAL_ERROR'
      }
    });
  }
});

/**
 * Controlador para obtener productos por rango de precio
 * @param {Object} req - Request object con query params: minPrice, maxPrice
 * @param {Object} res - Response object
 * @returns {Object} Lista de productos en el rango de precio
 */
const getProductsByPriceRange = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    // Validar parámetros usando servicio de validación de negocio
    const validatedPrice = businessValidationService.validatePriceParams({ minPrice, maxPrice });

    // Obtener productos usando servicio de productos
    const result = await productService.getProductsByPriceRange(validatedPrice);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: result.products,
      count: result.count,
      priceRange: result.priceRange,
      analysis: result.analysis
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: {
        message: error.message,
        code: error.code || 'VALIDATION_ERROR'
      }
    });
  }
});

/**
 * Controlador para obtener productos por rating mínimo
 * @param {Object} req - Request object con query param: minRating
 * @param {Object} res - Response object
 * @returns {Object} Lista de productos con rating >= minRating
 */
const getProductsByRating = asyncHandler(async (req, res) => {
  const { minRating } = req.query;

  try {
    // Validar parámetros usando servicio de validación de negocio
    const validatedRating = businessValidationService.validateRatingParams({ minRating });

    // Obtener productos usando servicio de productos
    const result = await productService.getProductsByRating(validatedRating);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: result.products,
      count: result.count,
      minRating: result.minRating,
      analysis: result.analysis
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: {
        message: error.message,
        code: error.code || 'VALIDATION_ERROR'
      }
    });
  }
});

/**
 * Controlador para buscar productos por especificaciones
 * @param {Object} req - Request object con query param: spec
 * @param {Object} res - Response object
 * @returns {Object} Lista de productos que contienen la especificación
 */
const searchProductsBySpec = asyncHandler(async (req, res) => {
  const { spec } = req.query;

  try {
    // Validar parámetros usando servicio de validación de negocio
    const validatedSpec = businessValidationService.validateSpecificationParams({ spec });

    // Obtener productos usando servicio de productos
    const result = await productService.searchProductsBySpecification(validatedSpec);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      data: result.products,
      count: result.count,
      searchTerm: result.searchTerm,
      analysis: result.analysis
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({
      error: {
        message: error.message,
        code: error.code || 'VALIDATION_ERROR'
      }
    });
  }
});

module.exports = {
  getProducts,
  getProduct,
  getBulkProducts,
  getProductStats,
  getProductsByPriceRange,
  getProductsByRating,
  searchProductsBySpec
};
