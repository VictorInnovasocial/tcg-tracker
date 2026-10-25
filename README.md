# TCG Tracker

Web gratuita para saber cuánto vale tu colección de cartas **Pokémon** y **Magic: The Gathering**, con precios de Cardmarket en euros. Sin registro: la colección se guarda en el navegador.

Es también un proyecto de ingresos pasivos: cada botón de compra lleva un enlace de afiliado. La metodología completa está en [METODOLOGIA.md](METODOLOGIA.md).

## Qué incluye

| Página | Qué hace |
|---|---|
| `index.html` | Busca cartas, añádelas a tu carpeta, ve el valor total y su evolución diaria, exporta/importa una copia. Botones «Comprar» (Cardmarket) y «Amazon» con tu etiqueta de afiliado. |
| `coste.html` | Contador en tiempo real de lo que te cuesta no empezar: rentabilidad que no cobras, inflación y retraso del proyecto. Tabla de «empezar hoy vs. dentro de un año», plan paso a paso y reglas sobre cripto. |

Precios: [Scryfall](https://scryfall.com/docs/api) (Magic) y [Pokémon TCG API](https://pokemontcg.io) (Pokémon). Ambas son gratuitas y no necesitan clave.

## Ponerla en marcha (10 minutos)

1. Fusiona esta rama en `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. El workflow `.github/workflows/pages.yml` pasa los tests y publica la web en `https://<tu-usuario>.github.io/tcg-tracker/`.
4. Date de alta en [Amazon Afiliados](https://afiliados.amazon.es) y escribe tu etiqueta en `js/config.js` (`amazonTag`). Opcional: enlace de donación en `donateUrl`.

## Desarrollo

```bash
npm test     # tests unitarios (node --test, sin dependencias)
npm start    # sirve la web en http://localhost:3000
```

Es HTML + JavaScript sin compilación. Usa módulos ES, así que hay que abrirla con un servidor (no con doble clic en el archivo).

```
index.html, coste.html   páginas
css/styles.css           estilos comunes (tema claro y oscuro)
js/api.js                búsqueda y precios (Scryfall, Pokémon TCG API)
js/collection.js         lógica de la colección (funciones puras)
js/finance.js            cálculos del coste de oportunidad (funciones puras)
js/config.js             etiquetas de afiliado
tests/                   tests unitarios
```
