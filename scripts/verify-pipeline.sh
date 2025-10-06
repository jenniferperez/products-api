#!/bin/bash

echo "🔍 Verificando pipeline de GitHub Actions..."

echo "📦 Verificando dependencias..."
npm ci

echo "🧹 Ejecutando lint..."
npm run lint

echo "📊 Generando reportes de lint..."
mkdir -p reports
npm run lint:html

echo "🧪 Ejecutando tests..."
npm test

echo "📈 Generando cobertura..."
npm run test:coverage

echo "✅ Pipeline verificado exitosamente!"
echo "🚀 Listo para GitHub Actions"
