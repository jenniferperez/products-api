# GitHub Actions CI/CD Guide

Esta guía describe el pipeline automatizado de CI/CD implementado con GitHub Actions para el proyecto Products API.

## Pipeline Overview

El pipeline está optimizado para ejecutar verificaciones en paralelo, reutilizar dependencias y desplegar automáticamente cuando todos los checks pasan exitosamente.

## Arquitectura del Pipeline

### Job Prepare (Setup Principal)
- **Propósito**: Instalar dependencias una sola vez y generar artefactos compartidos
- **Optimizaciones**:
  - Cache de npm habilitado nativamente
  - Cache adicional de `~/.npm` para máximo rendimiento
  - Upload de `node_modules` como artifact reutilizable

### Jobs Paralelos (Después de Prepare)

#### 🧹 Lint Job
- **Función**: Análisis estático de código con ESLint
- **Comandos**: `npm run lint` → `npm run lint:html`
- **Artifacts**: Reportes HTML en formato `reports/`
- **Comportamiento**: Falla el pipeline si encuentra errores

#### 🧪 Test & Coverage Job
- **Función**: Tests unitarios + análisis de cobertura
- **Comandos**: `npm test` → `npm run test:coverage`
- **Integración**: Upload automático a Codecov
- **Artifacts**: Coverage reports (HTML + LCOV)
- **Requisito**: Cobertura mínima > 80%

### Deploy Job (Condicional)
- **Trigger**: Solo en `push` a rama `main`
- **Condicion**: Todos los jobs anteriores deben pasar
- **Target**: Render.com (producción)
- **Verificación**: Status check automatizado post-deploy

## Configuración Requerida

### GitHub Secrets
Configurar en: `Settings` → `Secrets and variables` → `Actions`

#### Required Secrets:
```bash
RENDER_API_KEY=rw_xxxxxxxxxx     # Render API Key
RENDER_SERVICE_ID=srv-xxxxxxxxx  # Render Service ID
```

#### Cómo obtener los valores:

**RENDER_API_KEY:**
1. Visit: Render Dashboard → Account Settings → API Keys
2. Generate new key si es necesario
3. Copy y paste en GitHub secrets

**RENDER_SERVICE_ID:**
1. Render Dashboard → Tu Web Service
2. Settings → Service Details
3. Copy "Service ID"

### Ambiente en Render
```bash
NODE_VERSION=18
NPM_VERSION=latest
NODE_ENV=production
```

## Optimizaciones Implementadas

### 1. Cache Strategy
- **npm cache**: Integrado con GitHub Actions
- **~/.npm cache**: Cache manual para máximo speed
- **node_modules artifact**: Compartido entre jobs paralelos

### 2. Paralelización
```yaml
# Ejecución concurrente de lint + test-coverage
jobs:
  prepare: ← Solo job secuencial (setup)
  lint: ← Paralelo (después de prepare)
  test-and-coverage: ← Paralelo (después de prepare)
  deploy: ← Solo si todo pasa
```

### 3. Resource Efficiency
- Install de dependencies solo una vez
- Reutilización de artifacts entre jobs
- Skip de steps innecesarios en PRs

## Workflow Triggers

| Event | Branches | Deploy | Jobs |
|-------|----------|--------|------|
| `push` | `main` | ✅ | All |
| `push` | `feature/*` | ❌ | CI/CD only |
| `pull_request` | `main` | ❌ | CI/CD only |

## Monitoreo y Debugging

### GitHub Actions Dashboard
- URL: `https://github.com/[owner]/[repo]/actions`
- Real-time logs durante ejecución
- Download artifacts en caso de fallos

### Artifacts Disponibles
- `lint-reports/` - ESLint HTML reports
- `test-coverage-reports/` - Jest coverage + LCOV files
- `build-environment` - Dependencies cache

### Pipeline Health Checks
```bash
# Verificación local antes de push
npm ci && npm run lint && npm test && npm run test:coverage

# Verificar conexión Render
curl -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services/$RENDER_SERVICE_ID"
```

## Troubleshooting Guide

### Build Failures
```bash
# Clean install si npm ci falla
rm -rf node_modules package-lock.json
npm install
git add package-lock.json && git commit -m "fix: update dependencies"

# Cache issues
npm cache clean --force
```

### Test Failures
```bash
# Coverage local
npm run test:coverage
open src/test/coverage/lcov-report.html

# Tests específicos
npm test -- --testNamePattern="productController"
```

### Deploy Failures
- ✅ Verify GitHub secrets están configurados
- ✅ Check Render service existe y está activo
- ✅ Review Render dashboard logs
- ✅ Confirm API permissions en Render

### Performance Issues
- Review cache hit rates en Actions logs
- Optimize test suite si very slow
- Consider matrix strategy para jobs muy largos

## Scripts Command Reference

### Development Local
```bash
# Pipeline steps localmente
npm ci                           # Install (matches CI)
npm run lint                      # Code quality
npm test                          # Unit tests  
npm run test:coverage             # Coverage analysis
```

### CI/CD Debugging
```bash
# Enable verbose logging
echo "ACTIONS_STEP_DEBUG=true" >> $GITHUB_ENV
echo "ACTIONS_RUNNER_DEBUG=true" >> $GITHUB_ENV

# Artifact management
gh release list                      # List releases
gh action download-artifact XX      # Download artifacts
```

## Estructura de Archivos

```
.github/workflows/
├── ci-cd.yml              # Pipeline principal
└── reusable-setup.yml     # Template compartido (opcional)

src/docs/
├── GITHUB_ACTIONS_GUIDE.md  # Esta guía
└── README.md                # Documentación general
```

## Best Practices

### 1. Branch Protection Rules
- Require pull request reviews (min 1)
- Require status checks: `lint`, `test-and-coverage`
- Restrict pushes to main (admin only)

### 2. Security Best Practices
- All secrets wrapped en `${{ secrets.VAR }}`
- No logging de sensitive variables
- Regular rotation de API keys
- Environment protection enabled

### 3. Performance Optimization
- Cache aggressive de node_modules
- Parálizar todo posible
- Minimize artifact sizes

### 4. Monitoring & Alerting
```yaml
# Ejemplo webhook notifications
- name: Notify deployment
  if: job.status == 'success'
  run: |
    curl -X POST "${{ secrets.SLACK_WEBHOOK }}" \
      -d '{"text":"✅ Deploy successful!'}"
```

## Useful URLs

- **Pipeline**: `https://github.com/[owner]/[repo]/actions`
- **Render Dashboard**: `https://dashboard.render.com`
- **Codecov Reports**: `https://codecov.io/github/[owner]/[repo]`
- **Live Documentation**: `https://[your-app].onrender.com/api-docs`

## Emergency Procedures

### Rollback Deployment
1. Navigate to Render dashboard
2. Select previous deployment
3. Click "Rollback"

### Disable Auto-Deploy
1. Edit `.github/workflows/ci-cd.yml`
2. Comment out deploy job temporarily
3. Commit to trigger new pipeline without deploy

### Manual Deploy
```bash
# Direct API call
curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY"
```