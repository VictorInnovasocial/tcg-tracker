# Campus PREMÁSTER · UEx 2027

Plataforma personal para preparar el **Máster Universitario en Investigación en Ciencias Sociales** de la Universidad de Extremadura (especialidad Ciencias de la Educación, Facultad de Formación del Profesorado, Cáceres), curso 2027/2028.

HTML, CSS y JavaScript sin dependencias ni servidor propio. El progreso se guarda en el navegador (`localStorage`) y se exporta o importa en JSON.

## Abrirla

Usa módulos ES, así que necesita un servidor estático (no funciona con doble clic en el archivo):

```bash
npm start            # desde la raíz del repositorio
# abre http://localhost:3000/campus/
```

Si el repositorio se publica en GitHub Pages con el workflow existente, queda en `https://<usuario>.github.io/tcg-tracker/campus/`.

## Qué hace ya (prototipo 1)

| Función | Estado |
|---|---|
| Panel de inicio: próxima tarea recomendada, minutos de la semana frente a la meta, calendario de 10 semanas, cronómetro y registro de sesiones | Funciona |
| Catálogo del plan con estructura de ECTS, enlaces a la UEx y al BOE, y registro de verificación de cada guía docente | Funciona. Datos del plan **pendientes de cotejar** |
| Unidad 1 de *Iniciación a la Investigación en Ciencias Sociales*: 5 secciones con teoría, ejemplos guiados y recuperación de memoria obligatoria | Funciona |
| 4 ejercicios (3 de clasificación con segundo intento, 1 abierto con autoevaluación y propuesta de referencia) | Funciona |
| Test de 8 preguntas con corrección razonada de cada opción y segundo intento antes de ver la solución | Funciona |
| Repaso espaciado (SM-2 simplificado): hay que escribir la respuesta antes de verla | Funciona |
| Historial de errores: cada fallo fuerza el repaso del concepto; se cierra al recordarlo bien | Funciona |
| Biblioteca: fuentes académicas separadas del material IA, estado de lectura, notas, referencias propias | Funciona |
| Portafolio: matriz de consistencia, ejercicio abierto y reflexión, descargables en Markdown | Funciona |
| Exportar, importar y restablecer datos; meta semanal y días de estudio | Funciona |

No hay ninguna conexión con Moodle, Notion, sistemas de la UEx ni modelos de IA.

## Arquitectura

```
campus/
  index.html              carcasa: barra lateral + <main>
  css/campus.css          estilos (tokens claro/oscuro, responsive)
  js/
    app.js                arranque, estado global, guardado y enrutado por hash (#/vista/parámetros)
    core/                 lógica pura, sin DOM, cubierta por tests
      store.js            forma del estado, validación, import/export, load/save
      srs.js              repaso espaciado
      learning.js         corrección de tests, errores, progreso de unidad
      planner.js          semanas, calendario, recomendación de la siguiente tarea
    content/              contenido como datos (sin lógica)
      catalog.js          plan de estudios y asignaturas
      references.js       bibliografía real
      iics-u1.js          unidad 1 (teoría, conceptos, ejercicios, test, reflexión, actividad)
      index.js            registro de unidades y conceptos
    views/                una vista por pantalla: render(ctx) → HTML, bind(root, ctx) → eventos
```

Principios:

- **El contenido es un dato.** Una unidad es un objeto con `sections`, `concepts`, `exercises`, `quiz`, `reflection`, `activity` y `references`. La interfaz no sabe nada de metodología: pinta lo que haya.
- **La lógica es pura.** Todo lo que decide (puntuar, programar repasos, recomendar la siguiente tarea) está en `core/` y se prueba con `node --test` sin navegador.
- **El estado es uno.** Un único objeto JSON con `schemaVersion`. Exportar es serializarlo; importar es validarlo con `normalize()`. Si cambia la forma, se añade una migración en `store.js` y se sube la versión.
- **El concepto es la unidad de memoria.** Cada concepto tiene una tarjeta de repaso y es lo que se anota cuando hay un error, venga del test, de un ejercicio o de una recuperación.

### Añadir una unidad

1. Crea `js/content/<asignatura>-u<n>.js` copiando la estructura de `iics-u1.js`.
2. Impórtala en `js/content/index.js` y añádela a `UNITS`.
3. Añade su id a `units` de la asignatura en `catalog.js`.
4. `npm test` comprueba que conceptos, preguntas y referencias estén bien enlazados.

## Hoja de ruta

| Fase | Contenido | Criterio para pasar a la siguiente |
|---|---|---|
| **0. Validación** (ahora) | Unidad 1 de IICS. Usarla 3–4 semanas. | ¿Recuerdas los conceptos a las 3 semanas? ¿La matriz de consistencia mejora entre versiones? ¿Qué te sobra o te falta? |
| **1. Fuentes oficiales** | Cotejar el plan con el BOE. Anotar las guías docentes 2026/27 en el catálogo. Ajustar unidades a sus temarios. | Cada asignatura con guía anotada o marcada como no publicada. |
| **2. IICS completa** | Unidades 2–5 según la guía (previsiblemente: paradigmas y enfoques, diseños, muestreo, técnicas de recogida y análisis, ética). | Test superado en todas y una matriz de consistencia revisada. |
| **3. Documentación científica** | *Tecnologías de la Comunicación y la Documentación Científica*: búsqueda en bases de datos, gestores bibliográficos, APA 7, escritura académica. Proyecto: revisión de literatura breve sobre el tema del anteproyecto. | Revisión con 15–20 fuentes reales registradas en la biblioteca. |
| **4. Optativas** | Una optativa cada vez, en el orden que decidas cuando estén elegidas. | Guía docente consultada antes de crear contenido. |
| **5. Anteproyecto de TFM** | Integrar problema, revisión, diseño e instrumentos en un documento para presentar a una posible tutora o tutor. | Borrador completo en el portafolio. |

Mejoras técnicas previstas, solo si la validación las justifica: estadísticas de retención por concepto, modo examen sin segundo intento, PWA para estudiar sin conexión, aviso para exportar si hace más de 14 días de la última copia.

## Rigor y procedencia

- Los textos de las unidades están marcados como **Material de estudio IA**. No son el programa oficial ni fuentes citables.
- Las referencias de la biblioteca son obras reales de metodología, pero sus datos se escribieron sin acceso a internet: comprueba la edición en el catálogo de la Biblioteca UEx antes de citarlas.
- La estructura del plan (60 ECTS: 12 obligatorios, 36 optativos, 12 de TFM) y la lista de asignaturas proceden de lo indicado por el estudiante; las páginas de la UEx y del BOE no se pudieron consultar al crear el prototipo.
