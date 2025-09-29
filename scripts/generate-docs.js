#!/usr/bin/env node

/**
 * Script para generar documentación de la API
 * Genera swagger.json y sirve la documentación
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📚 Generando documentación de la API...');

try {
  // Verificar que el directorio docs existe
  const docsDir = path.join(__dirname, 'src/docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
    console.log('✅ Directorio src/docs creado');
  }

  // Generar swagger.json
  console.log('🔄 Generando swagger.json...');
  execSync('npm run docs:generate', { stdio: 'inherit' });
  
  console.log('✅ Documentación generada exitosamente');
  console.log('📄 Archivos creados:');
  console.log('   - src/docs/swagger.json');
  console.log('   - src/docs/README.md');
  console.log('   - src/docs/API_REFERENCE.md');
  console.log('   - src/docs/DEVELOPMENT_GUIDE.md');
  console.log('   - src/docs/CHANGELOG.md');
  
  console.log('\n🌐 Para ver la documentación:');
  console.log('   - Swagger UI: http://localhost:3000/api-docs');
  console.log('   - JSON Spec: http://localhost:3000/api-docs.json');
  
  console.log('\n📖 Para leer la documentación:');
  console.log('   - README: src/docs/README.md');
  console.log('   - API Reference: src/docs/API_REFERENCE.md');
  console.log('   - Development Guide: src/docs/DEVELOPMENT_GUIDE.md');
  
} catch (error) {
  console.error('❌ Error generando documentación:', error.message);
  process.exit(1);
}
