# NEXO ARENA LAB — Pokémon TCG · prototipo GitHub

Aplicación de seguimiento competitivo en `arena-lab/`, aislada del prototipo de valoración de colecciones que ya existe en el repositorio. **No modificar ni sustituir el `index.html` raíz.**

## Acceso permanente

- **Dashboard:** https://nexo-arena-lab.vercel.app/
- **Entrenador competitivo:** https://nexo-arena-lab.vercel.app/coach.html
- **Estado:** desplegado en Vercel producción (READY verificado el 08/11/2026).
- **Privacidad:** aplicación pública, datos abreviados con alias; no publicar logs íntegros con identificadores.
- **Actualización:** GitHub y Vercel **NO tienen conexión de despliegue automático**. Cada edición de los JSON del repositorio requiere volver a publicar los archivos en Vercel para que el sitio web refleje los cambios. El módulo de pegado de logs del navegador almacena en localStorage sin crear un commit. El análisis de errores se actualiza mediante revisión de logs en ChatGPT y edición de `coaching.json`, no con IA dentro del navegador.

## Recomendación competitiva semanal

- [¿Qué jugar?](https://nexo-arena-lab.vercel.app/que-jugar.html): modo rendimiento propio (W/L), modo torneo y modo meta; corte semanal con fuentes y segmentos separados Japón / online.
- [Lista recomendada](https://nexo-arena-lab.vercel.app/lista-recomendada.html): referencia completa de 60 cartas verificadas (actualmente Crustle Kangaskhan Ryūichi, Niigata 07/11/2026), riesgos, gameplan, evidencia y exportación para TCG Live.
- Datos versionados en `data/meta-weekly.json` y `data/recommendation.json`, fechas `reviewedAt`, fuentes y restricciones de legalidad.
- Hay una automatización semanal los lunes por la mañana, que debe verificar si pudo actualizar GitHub y redesplegar Vercel; **los datos no se refrescan solos** por estar alojados como JSON estáticos.
- No sumar proporciones de Top16 con presencia online; tampoco presentar Top16 como winrate del torneo.

## Qué hace

- Registra partidas reales por mazo y **versión exacta**, resultado, marcador, arquetipo, evidencia y aprendizaje.
- Calcula winrate y volumen de muestra por matchup y por versión; incluye filtros y búsqueda.
- Permite **pegar un log en español de Pokémon TCG Live**, detectar rival/ganador/Premios de manera heurística y revisar la ficha.
- Guarda nuevos registros **localmente en el navegador** y ofrece exportación JSON de copia de seguridad.
- Los registros compartidos en el chat pueden incorporarse a GitHub mediante el conector, actualizando `arena-lab/data/matches.json`; el panel se actualiza al recargar.

## Datos y reglas de rigor

- `data/decks.json`: catálogo de mazos, con versiones experimentales a **0–0**; se conservan referencias a NEXO.
- `data/matches.json`: **10 resultados reales resumidos** de este seguimiento, sin publicar los logs completos ni nombres de usuarios rivales (alias).
- `data/baselines.json`: captura agregada Basic Box Mundial V1.0 **7–1**, diferenciada de partidas individuales y excluida del cómputo del panel.
- La japonesa de Rayquaza Aves suma **5–1** en su propia versión; Crustle Niigata **1–0**; Basic Box Talonflame V1.1 **1–1**, Rayquaza Lava Engine **0–1**.
- Un resultado comunicado sin log no genera Premio ni jugada inventada. Rendiciones se conservan como tales.
- Los cambios de cartas producen **una versión nueva** del mazo; nunca se mezclan estadísticas.

## Probar

Para visualizar desde el checkout de esta rama:

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/arena-lab/
```

No hay instalación de dependencias ni servidor con credenciales. Los `fetch` de JSON requieren abrir desde HTTP(S), no `file://`.

## Privacidad, sincronización y despliegue

**Este repositorio es público.** Por eso solo se han incluido resúmenes anonimizados y enlaces a fichas NEXO; no se han publicado logs íntegros, identificadores de rivales ni notas personales sensibles.

El prototipo **está desplegado en Vercel** como sitio estático. No existe integración automática GitHub–Vercel. El historial público de código GitHub funciona como almacenamiento versionado; una aplicación con datos privados exige repositorio/base de datos privados y autenticación. El conector GitHub puede escribir archivos cuando se solicita en el chat, pero **no existe una sincronización automática universal** entre cualquier chat y el repositorio. Los registros del navegador se mantienen en `localStorage` hasta su exportación/publicación explícita.

No fusionar esta rama en la predeterminada ni publicar los logs completos sin decidir primero el modelo de privacidad y despliegue.

## Siguiente iteración

Consolidar como **repositorio privado propio** y migrar a base SQL privada si la cantidad de partidas lo exige. Incluir cálculo de confianza por tamaño de muestra, matchups espejo, análisis de decisiones ex ante, historial de cambios entre versiones, y mecanismo autenticado para importar datos del chat sin copiar/pegar.
