# Products API

API RESTful para gestión de productos desarrollada con Node.js y Express.

## 🚀 Características

- **Endpoints RESTful** para gestión de productos
- **Seguridad robusta** con Helmet, CORS, Rate Limiting y validación Joi
- **Documentación interactiva** con Swagger UI
- **Manejo de errores centralizado** con respuestas consistentes
- **Validación de entrada** para prevenir ataques de inyección
- **Paginación y búsqueda** avanzada de productos
- **Estructura modular** y escalable

## 📋 Requisitos

### Desarrollo Local
- Node.js >= 16.0.0
- npm >= 8.0.0

### Docker
- Docker >= 20.0.0
- Docker Compose (opcional)

## 🛠️ Instalación

### Opción 1: Desarrollo Local

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd products-api
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (opcional):
```bash
cp .env.example .env
# Edita el archivo .env con tus configuraciones
```

### Opción 2: Docker (Recomendado)

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd products-api
```

2. Construye y ejecuta con Docker:
```bash
# Usando el script automatizado
./docker-commands.sh

# O manualmente
npm run docker:build
npm run docker:run
```

## 🚀 Uso

### Desarrollo Local
```bash
npm run dev
```

### Producción Local
```bash
npm start
```

### Docker
```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run

# Ver logs
npm run docker:logs

# Detener contenedor
npm run docker:stop

# Eliminar contenedor
npm run docker:rm
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## 📚 Documentación de la API

Una vez iniciado el servidor (local o Docker), la documentación interactiva estará disponible en:
- **Swagger UI**: http://localhost:3000/api-docs
- **Especificación JSON**: http://localhost:3000/api-docs.json
- **API Base**: http://localhost:3000/api/v1

## 🔗 Endpoints Disponibles

### Productos
- `GET /api/products` - Lista paginada de productos
- `GET /api/products/:id` - Detalle de un producto
- `GET /api/products/bulk?ids=1,2,3` - Múltiples productos por ID
- `GET /api/products/stats` - Estadísticas de productos
- `GET /api/products/search/price?minPrice=100&maxPrice=500` - Búsqueda por precio
- `GET /api/products/search/rating?minRating=4.5` - Búsqueda por rating
- `GET /api/products/search/specs?spec=A17 Pro` - Búsqueda por especificaciones

### General
- `GET /` - Información de la API

## 🛡️ Seguridad Implementada

### Middleware de Seguridad
- **Helmet**: Cabeceras HTTP seguras para prevenir XSS, clickjacking, etc.
- **CORS**: Control de acceso de origen cruzado configurado por ambiente
- **Rate Limiting**: Límite de 50 requests/minuto para prevenir abuso
- **Validación Joi**: Validación robusta de entrada para prevenir inyección
- **Sanitización**: Limpieza de inputs para prevenir ataques XSS

### Manejo de Errores
- Respuestas consistentes en formato JSON
- No exposición de información sensible en producción
- Logging detallado para debugging
- Códigos de error personalizados

## 📊 Estructura del Proyecto

```
products-api/
├── src/
│   ├── app.js                 # Archivo principal de la aplicación
│   ├── controllers/           # Controladores de la lógica de negocio
│   │   └── productController.js
│   ├── data/                  # Datos y modelos
│   │   └── products.js
│   ├── middleware/            # Middleware personalizado
│   │   ├── errorHandler.js    # Manejo centralizado de errores
│   │   ├── security.js        # Middleware de seguridad
│   │   ├── swagger.js         # Configuración de Swagger
│   │   └── validation.js      # Validación con Joi
│   ├── routes/                # Definición de rutas
│   │   └── productRoutes.js
│   ├── services/              # Lógica de negocio
│   ├── utils/                 # Utilidades
│   ├── config/                # Configuraciones
│   ├── test/                  # Tests unitarios
│   └── docs/                  # Documentación
├── Dockerfile                 # Configuración Docker
├── .dockerignore             # Archivos excluidos de Docker
├── docker-commands.sh        # Script para Docker
├── DOCKER_README.md          # Documentación Docker
└── package.json              # Dependencias y scripts
```

## 🔧 Configuración

### Variables de Entorno

```env
NODE_ENV=development
PORT=3000
```

### Ambientes

- **Desarrollo**: CORS permisivo, logging detallado, stack traces
- **Producción**: CORS restringido, sin stack traces, validación de origen

### Docker

Para configurar variables de entorno en Docker:

```bash
docker run -d \
  --name products-api-container \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --restart unless-stopped \
  products-api
```

## 📝 Ejemplos de Uso

### Obtener productos paginados
```bash
curl "http://localhost:3000/api/products?page=1&limit=5"
```

### Buscar productos
```bash
curl "http://localhost:3000/api/products?q=iPhone"
```

### Obtener producto por ID
```bash
curl "http://localhost:3000/api/products/1"
```

### Obtener múltiples productos
```bash
curl "http://localhost:3000/api/products/bulk?ids=1,2,3"
```

## 🚀 CI/CD Pipeline

Este proyecto utiliza GitHub Actions para automatizar la construcción, testing y despliegue.

### Jobs del Pipeline
- **prepare**: Preparación del ambiente y cache
- **lint**: Análisis de código con ESLint
- **test-coverage**: Tests unitarios y cobertura
- **deploy**: Despliegue automático en Render
- **smoke-test**: Verificación de salud del servicio

Ver [`src/docs/SMOKE_TEST_PIPELINE_GUIDE.md`](src/docs/SMOKE_TEST_PIPELINE_GUIDE.md) para documentación completa.

### Secrets Requeridos
```bash
RENDER_API_KEY=tu-api-key
RENDER_SERVICE_ID=tu-service-id
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Requisitos para PR
- ✅ Tests pasando (`npm test`)
- ✅ Linting exitoso (`npm run lint`)
- ✅ Cobertura > 80% (`npm run coverage`)
- 📚 Documentación actualizada

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Tu Nombre - [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/)
- [Helmet](https://helmetjs.github.io/)
- [Joi](https://joi.dev/)
- [Swagger](https://swagger.io/)
- [Node.js](https://nodejs.org/)
