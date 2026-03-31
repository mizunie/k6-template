# k6 Dashboard & Script Generator

Herramientas visuales para pruebas de carga con k6, sin necesidad de instalar dependencias.

## Archivos

| Archivo | Descripción |
|---|---|
| `index.html` | Dashboard para visualizar resultados de pruebas |
| [Generador](https://mizunie.com/tool/k6-generator) | Generador visual de scripts k6 |
| `test.js` | Script de ejemplo incluido |

## Uso rápido

### 1. Generar un script

Abre [Generador](https://mizunie.com/tool/k6-generator) en tu navegador. Desde ahí puedes configurar:

- Patrón de carga: VUs constantes o stages (ramping)
- Peticiones HTTP (GET, POST, PUT, PATCH, DELETE) con headers y body
- Checks (verificaciones de status, body, duración)
- Thresholds (métricas objetivo como p95 < 500ms)

El script se genera en tiempo real. Descárgalo como `.js` o cópialo al portapapeles.

### 2. Ejecutar la prueba

```bash
k6 run --out json=resultados.json test.js
```

> El flag `--out json` es necesario para generar el archivo que consume el dashboard.

### 3. Ver el reporte

Abre `index.html` en tu navegador, haz clic en **Cargar JSON** y selecciona el `resultados.json` generado.

## Dashboard — métricas disponibles

- Total de peticiones, tasa de éxito y fallos, VUs máximos
- Tiempos de respuesta: promedio, p95, mínimo, máximo, desviación estándar
- Datos enviados/recibidos, peticiones por segundo, duración total
- Histograma de distribución de tiempos
- Evolución de VUs en el tiempo
- Detalle por URL y distribución por código HTTP
- Checks con porcentaje de éxito por tipo de verificación

## Requisitos

- [k6](https://k6.io/docs/getting-started/installation/) instalado
- Cualquier navegador moderno (no requiere servidor)
