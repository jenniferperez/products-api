#!/bin/bash

# Script para construir y ejecutar la aplicación con Docker

echo "🐳 Construyendo imagen de Docker..."
docker build -t products-api .

echo "🚀 Ejecutando contenedor..."
docker run -d \
  --name products-api-container \
  -p 3000:3000 \
  --restart unless-stopped \
  products-api

echo "✅ Contenedor ejecutándose en http://localhost:3000"
echo "📋 Para ver logs: docker logs products-api-container"
echo "🛑 Para detener: docker stop products-api-container"
echo "🗑️  Para eliminar: docker rm products-api-container"
