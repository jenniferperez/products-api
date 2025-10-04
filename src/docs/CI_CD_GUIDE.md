# CI/CD Guide - GitHub Actions

Este documento describe el pipeline de CI/CD configurado con GitHub Actions para el proyecto Products API.

## Overview

El pipeline automatiza la construcción, testing, linting y despliegue de la aplicación en cada push/PR a la rama `main`.

## Pipeline Jobs

### 1. Build
- **Propósito**: Verificar que el proyecto se construye correctamente
- **Configuración**: 
  - Node.js 18.x
  - Cache de dependencias npm
  - `npm ci` para instalación limpia
- **Artifacts**: None

### 2. Lint
- **Propósito**: Verificar calidad y estilo de código
- **Configuración**:
  - ESLint con configuración estándar
  - Reporte HTML generado
  - Falla si hay errores de linting
- **Artifacts**: 
  - `eslint-report.html` - Reporte HTML del análisis

### 3. Test
- **Propósito**: Ejecutar suite completa de tests
- **Configuración**:
  - Jest como framework de testing
  - Cubrimiento > 80%
  - Tests unitarios y de integración
- **Artifacts**:
  - Reportes de cobertura
  - Resultados de tests

### 4. Coverage
- **Propósito**: Generar reportes de cobertura
- **Configuración**:
  - Jest con `--coverage`
  - Integración con Codecov
  - Upload de reportes LCOV
- **Artifacts**:
  - HTML coverage report
  - LCOV data files

### 5. Deploy
- **Propósito**: Desplegar automáticamente en Render
- **Configuración**:
  - Solo ejecuta en rama `main`
  - Solo después de push (no PR)
  - Requiere que todos los jobs previos pasen
- **Trigger Conditions**:
  - `github.ref == 'refs/heads/main'`
  - `github.event_name == 'push'`

## Secrets Requeridos

Configurar en GitHub Settings > Secrets and variables > Actions:

### `RENDER_API_KEY`
- Tu API key de Render
- Obtener en: Dashboard > Account Settings > API Keys

### `RENDER_SERVICE_ID`
- ID único del servicio en Render
- Encontrarlo en: Dashboard > Service > Settings > Account

## Configuración en Render

1. **Crear servicio**:
   - Tipo: Web Service
   - Build Command: `npm ci`
   - Start Command: `npm start`

2. **Variables de entorno**:
   ```bash
   NODE_VERSION=18
   NPM_VERSION=latest
   ```

3. **Health Check**:
   - Path: `/api/products`
   - Timeout: 30s

## Workflow Triggers

| Event | Branch | Condition |
|-------|--------|-----------|
| Push | main | Deploy activado |
| Push | feature/ | Solo CI/CD |
| PR to main | any | Solo CI/CD |

## Monitoreo

### GitHub Actions Dashboard
- Ir a: `https://github.com/[owner]/[repo]/actions`
- Ver historial de ejecuciones
- Descargar artifacts de builds fallidos

### Render Dashboard
- Tu dashboard: `https://dashboard.render.com`
- Ver logs de deployment
- Monitorear métricas

## Troubleshooting

### Build Failures
```bash
# Verificar dependencias
npm ci

# Linting local
npm run lint

# Tests local
npm test
```

### Deploy Failures
1. Verificar secrets en GitHub
2. Comprobar configuración en Render
3. Revisar logs en Render dashboard

### Cache Issues
```bash
# Limpiar cache (si necesario)
npm cache clean --force
```

## Comandos Útiles

```bash
# Testing local
npm run test:ci

# Coverage local
npm run coverage

# Lint con reportes
npm run lint:html

# Docker (alternativa)
./docker-commands.sh
```

## Mejores Prácticas

1. **Branch Protection**: Configurar en GitHub Settings > Branches
2. **Required Status Checks**: Activar lint, test, coverage
3. **Review Requirements**: Mínimo 1 reviewer para PRs
4. **Security**: Nunca exponer secrets en logs

## URLs Importantes

- **GitHub Actions**: `https://github.com/[owner]/[repo]/actions`
- **Render Dashboard**: `https://dashboard.render.com`
- **Documentación API**: `https://[deployed-url]/api-docs`
- **Codecov**: `https://codecov.io/github/[owner]/[repo]`
