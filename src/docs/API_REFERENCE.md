# API Endpoints Reference

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://tu-api.com`

## Authentication
La API utiliza autenticación opcional mediante API Key:
- Header: `X-API-Key: your-api-key`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... },
  "analysis": { ... }
}
```

### Error Response
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": [ ... ]
  }
}
```

## Products Endpoints

### GET /api/products
Obtiene una lista paginada de productos.

**Query Parameters:**
- `page` (integer, optional): Número de página (default: 1, max: 1000)
- `limit` (integer, optional): Elementos por página (default: 10, max: 100)
- `q` (string, optional): Término de búsqueda

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "price": 999.99,
      "description": "El iPhone más avanzado...",
      "image_url": "https://example.com/images/iphone15pro.jpg",
      "rating": 4.8,
      "specs": { ... }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "searchTerm": ""
}
```

### GET /api/products/:id
Obtiene un producto específico por ID.

**Path Parameters:**
- `id` (integer, required): ID del producto

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "price": 999.99,
    "description": "El iPhone más avanzado...",
    "image_url": "https://example.com/images/iphone15pro.jpg",
    "rating": 4.8,
    "specs": { ... }
  },
  "found": true
}
```

### GET /api/products/bulk
Obtiene múltiples productos por IDs.

**Query Parameters:**
- `ids` (string, required): IDs separados por comas (max: 20)

**Example:** `?ids=1,2,3,4,5`

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 5,
  "requestedIds": [1, 2, 3, 4, 5],
  "foundIds": [1, 2, 3, 4, 5]
}
```

### GET /api/products/stats
Obtiene estadísticas de productos.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "averagePrice": 749.99,
    "averageRating": 4.7,
    "priceRange": {
      "min": 249.99,
      "max": 1299.99
    },
    "ratingRange": {
      "min": 4.5,
      "max": 4.9
    },
    "categories": { ... },
    "priceSegments": { ... },
    "ratingDistribution": { ... },
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

## Search Endpoints

### GET /api/products/search/price
Busca productos por rango de precio.

**Query Parameters:**
- `minPrice` (number, optional): Precio mínimo (default: 0)
- `maxPrice` (number, optional): Precio máximo (default: ∞)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 5,
  "priceRange": {
    "min": 100,
    "max": 500
  },
  "analysis": {
    "averagePrice": 350.00,
    "averageRating": 4.6,
    "priceRangeUtilization": 100,
    "bestValue": { ... }
  }
}
```

### GET /api/products/search/rating
Busca productos por rating mínimo.

**Query Parameters:**
- `minRating` (number, required): Rating mínimo (0-5)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 8,
  "minRating": 4.5,
  "analysis": {
    "averagePrice": 899.99,
    "averageRating": 4.7,
    "ratingDistribution": { ... },
    "topRated": [ ... ]
  }
}
```

### GET /api/products/search/specs
Busca productos por especificaciones.

**Query Parameters:**
- `spec` (string, required): Especificación a buscar (max: 200 chars)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "count": 3,
  "searchTerm": "Bluetooth",
  "analysis": {
    "averagePrice": 399.99,
    "averageRating": 4.8,
    "commonSpecifications": [ ... ],
    "relatedProducts": [ ... ]
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Error en parámetros de entrada |
| `PRODUCT_NOT_FOUND` | Producto no encontrado |
| `PRODUCTS_NOT_FOUND` | Productos no encontrados |
| `INVALID_PRICE_RANGE` | Rango de precios inválido |
| `INVALID_RATING_RANGE` | Rango de rating inválido |
| `MISSING_SPEC_PARAM` | Parámetro de especificación faltante |
| `RATE_LIMIT_EXCEEDED` | Límite de velocidad excedido |
| `INTERNAL_ERROR` | Error interno del servidor |

## Rate Limits

- **General**: 50 requests por minuto por IP
- **Search**: 20 requests por minuto por IP

## Examples

### cURL Examples

```bash
# Get all products
curl "http://localhost:3000/api/products"

# Get products with pagination
curl "http://localhost:3000/api/products?page=2&limit=5"

# Search products
curl "http://localhost:3000/api/products?q=iPhone"

# Get product by ID
curl "http://localhost:3000/api/products/1"

# Get multiple products
curl "http://localhost:3000/api/products/bulk?ids=1,2,3"

# Get product statistics
curl "http://localhost:3000/api/products/stats"

# Search by price range
curl "http://localhost:3000/api/products/search/price?minPrice=100&maxPrice=500"

# Search by rating
curl "http://localhost:3000/api/products/search/rating?minRating=4.5"

# Search by specifications
curl "http://localhost:3000/api/products/search/specs?spec=Bluetooth"
```

### JavaScript Examples

```javascript
// Fetch products
const response = await fetch('http://localhost:3000/api/products?page=1&limit=10');
const data = await response.json();

// Search by price
const priceResponse = await fetch('http://localhost:3000/api/products/search/price?minPrice=100&maxPrice=500');
const priceData = await priceResponse.json();

// Get product stats
const statsResponse = await fetch('http://localhost:3000/api/products/stats');
const stats = await statsResponse.json();
```

## Changelog

### v1.0.0
- Initial release
- Basic CRUD operations
- Search and filtering
- Statistics and analytics
- Swagger documentation
- Security features
