# Metodología: ingresos pasivos sin trucos

Este documento acompaña a la web. El orden importa: primero lo que funciona seguro y casi sin esfuerzo, después el proyecto, y la especulación al final y en pequeño.

## La verdad que nadie te vende

- **Ingreso pasivo de verdad = capital trabajando.** Un fondo indexado global ha rendido de media alrededor de un 7 % anual nominal a largo plazo, con años de −20 % o peores. No necesita tu tiempo.
- **Un proyecto online es semipasivo.** Requiere trabajo al principio y un mantenimiento mínimo después. Los primeros meses suele ganar entre 0 y 50 € al mes. Lo que lo hace crecer es el tráfico.
- **La especulación (cripto, trading) no es ingreso pasivo.** Es riesgo. Puede salir bien, pero no hay método infalible.

## Paso 1. Hoy, 30 minutos: el dinero parado

1. **Colchón:** 3 a 6 meses de gastos en una cuenta remunerada o un fondo monetario.
2. **El resto:** un fondo indexado global (MSCI World o MSCI ACWI) con comisiones bajas. Ejemplos de plataformas en España: MyInvestor, Indexa Capital, Trade Republic, Openbank. Compara comisiones antes de elegir.
3. **Aportación automática mensual.** Una cantidad fija el día después de cobrar. No mires el precio.
4. **Fiscalidad en España:** los fondos de inversión permiten traspasos sin tributar hasta que vendes (los ETF no). Las ganancias tributan en la base del ahorro.

Usa `coste.html` para ver lo que te cuesta cada día que no lo haces, con tus cifras.

## Paso 2. Esta semana: publicar TCG Tracker

La web ya está hecha. Para que genere ingresos:

1. Publícala en GitHub Pages (instrucciones en el README).
2. **Amazon Afiliados España:** alta gratuita, pon tu etiqueta en `js/config.js`. Cobras un porcentaje de cualquier compra que haga el visitante en las 24 h siguientes al clic, no solo de la carta.
3. **Cardmarket:** si consigues un acuerdo de partner, pon tu `referrer` en `js/config.js`.
4. **Donaciones:** un enlace de Ko-fi o Buy Me a Coffee en `donateUrl`.
5. Cuando tengas tráfico (unas 10.000 visitas al mes), puedes añadir publicidad (Google AdSense, Ezoic).

### Cuentas realistas

Ejemplo con supuestos conservadores, para que sepas qué mover:

| Visitas/mes | Clics a tienda (8 %) | Compras (5 % de clics) | Ticket medio | Comisión (5 %) | Ingreso/mes |
|---:|---:|---:|---:|---:|---:|
| 1.000 | 80 | 4 | 40 € | 2 € | 8 € |
| 10.000 | 800 | 40 | 40 € | 2 € | 80 € |
| 50.000 | 4.000 | 200 | 40 € | 2 € | 400 € |

La palanca es el tráfico. Todo lo demás es secundario.

## Paso 3. Cada semana, 2 horas: tráfico

- **Comunidades:** r/PokemonTCG, r/mtgfinance, r/magicTCG, servidores de Discord, grupos de Facebook y Telegram de tiendas españolas. Comparte la herramienta cuando aporte algo (alguien pregunta «¿cuánto vale mi carpeta?»), no como spam.
- **Vídeo corto:** TikTok, Reels y Shorts con «valoro la carpeta de mi infancia» usando la web en pantalla. Es el formato que más visitas trae en este nicho.
- **Contenido con búsquedas:** páginas sobre las cartas más caras de cada colección nueva, guías de «cuánto vale un Charizard de 1999», etc. Cada nueva expansión es una oportunidad.
- **Tiendas locales:** ofrece la herramienta a tiendas de cartas para que la compartan.

## Paso 4. Cada mes: medir y reinvertir

Apunta cada mes: visitas, clics en «Comprar»/«Amazon», ingresos. Reinvierte lo que gane la web en la aportación automática del paso 1. Ideas para crecer cuando tengas visitas:

- Alertas de precio por email (necesita un pequeño backend o un servicio como Cloudflare Workers).
- Páginas estáticas por carta para posicionar en Google.
- Más juegos: Yu-Gi-Oh!, One Piece, Lorcana.
- Versión premium (exportar a Excel, historial ilimitado, varias carpetas).

## Criptomonedas: lo honesto

**No existe una metodología infalible.** Si existiera, quien la tiene no la vendería. Los «sistemas» que se venden ganan con tu suscripción o con tu dinero.

Lo que sí reduce mucho el riesgo de perderlo todo:

1. **Tamaño:** como máximo un 5 a 10 % de lo que inviertes, y solo dinero que puedas perder entero.
2. **Qué:** Bitcoin y, si quieres, Ethereum. El resto de monedas tiene una tasa de desaparición altísima.
3. **Cómo:** compra periódica de una cantidad fija (DCA), por ejemplo 50 € al mes, sin intentar adivinar el momento.
4. **Nunca:** apalancamiento, futuros, «copy trading», bots que prometen rentabilidad fija, monedas recomendadas por influencers o por desconocidos que te escriben.
5. **Dónde:** exchange registrado en el Banco de España o con licencia MiCA. Lo acumulado, a una cartera propia (hardware wallet) cuya frase semilla guardas en papel y nunca escribes en ningún sitio web.
6. **Hacienda:** las ganancias tributan en la base del ahorro de la renta. Los exchanges informan a Hacienda. Si tienes más de 50.000 € en cripto en plataformas extranjeras, debes presentar el modelo 721.

## Sobre el contador de «euros perdidos»

`coste.html` calcula el valor esperado de lo que dejas de ganar mientras esperas:

- **Rentabilidad no cobrada:** tu dinero parado frente al rendimiento esperado de un fondo indexado.
- **Inflación:** el poder adquisitivo que pierde el dinero en la cuenta corriente.
- **Retraso del proyecto:** si el proyecto acabará ganando X € al mes, cada hora de retraso desplaza toda la curva una hora.

Es una estimación, no una pérdida segura. Las cifras por defecto son ejemplos: pon las tuyas.

*Esto no es asesoramiento financiero personalizado.*
