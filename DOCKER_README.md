# 🐳 Docker Setup para Products API

## Archivos Docker

- **`Dockerfile`**: Configuración de la imagen de Docker
- **`.dockerignore`**: Archivos excluidos del contexto de build
- **`docker-commands.sh`**: Script para construir y ejecutar el contenedor

## Características del Dockerfile

✅ **Imagen ligera**: `node:18-alpine`  
✅ **Usuario no root**: Ejecuta como usuario `nodejs`  
✅ **Cache de dependencias**: Copia `package*.json` primero  
✅ **Puerto expuesto**: 3000  
✅ **Optimizado**: Solo archivos necesarios  

## Comandos Docker

### Construir la imagen
```bash
npm run docker:build
# o
docker build -t products-api .
```

### Ejecutar el contenedor
```bash
npm run docker:run
# o
docker run -d --name products-api-container -p 3000:3000 --restart unless-stopped products-api
```

### Ver logs
```bash
npm run docker:logs
# o
docker logs products-api-container
```

### Detener el contenedor
```bash
npm run docker:stop
# o
docker stop products-api-container
```

### Eliminar el contenedor
```bash
npm run docker:rm
# o
docker rm products-api-container
```

### Script automatizado
```bash
./docker-commands.sh
```

## Acceso a la API

Una vez ejecutándose, la API estará disponible en:
- **API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/api-docs

## Variables de entorno

Para configurar variables de entorno, puedes usar:

```bash
docker run -d \
  --name products-api-container \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --restart unless-stopped \
  products-api
```

## Verificación

```bash
# Verificar que el contenedor está ejecutándose
docker ps

# Probar la API
curl http://localhost:3000/api/v1/products

# Ver logs en tiempo real
docker logs -f products-api-container
```
