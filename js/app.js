import { searchCards, fetchCard, amazonUrl, GAMES } from './api.js';
import {
  addCard, setQty, removeCard, updatePrice, totalValue, totalCards, recordSnapshot, parseImport,
} from './collection.js';
import { CONFIG } from './config.js';

const KEY_COLLECTION = 'tcg.collection';
const KEY_HISTORY = 'tcg.history';

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const $ = (id) => document.getElementById(id);

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* almacenamiento no disponible */ }
}

let collection = load(KEY_COLLECTION);
let history = load(KEY_HISTORY);

// Crea un elemento con atributos y nodos hijos; el texto siempre entra como texto, nunca como HTML.
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'onclick') node.addEventListener('click', v);
    else if (v !== undefined && v !== null && v !== false) node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child !== null && child !== undefined) node.append(child);
  }
  return node;
}

function priceText(price) {
  return price == null ? 'sin precio' : eur.format(price);
}

function commit(next) {
  collection = next;
  save(KEY_COLLECTION, collection);
  history = recordSnapshot(history, totalValue(collection));
  save(KEY_HISTORY, history);
  renderCollection();
}

function renderSpark() {
  const svg = $('spark');
  if (history.length < 2) { svg.hidden = true; return; }
  const values = history.map((h) => h.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * 300,
    72 - ((v - min) / span) * 64,
  ]);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const [lx, ly] = pts[pts.length - 1];
  svg.replaceChildren();
  const ns = 'http://www.w3.org/2000/svg';
  const area = document.createElementNS(ns, 'polygon');
  area.setAttribute('points', `0,80 ${line} 300,80`);
  area.setAttribute('fill', 'var(--accent-soft)');
  const poly = document.createElementNS(ns, 'polyline');
  poly.setAttribute('points', line);
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', 'var(--accent)');
  poly.setAttribute('stroke-width', '2');
  poly.setAttribute('vector-effect', 'non-scaling-stroke');
  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('cx', lx);
  dot.setAttribute('cy', ly);
  dot.setAttribute('r', '3');
  dot.setAttribute('fill', 'var(--accent)');
  svg.append(area, poly, dot);
  svg.hidden = false;
}

function renderCollection() {
  const value = totalValue(collection);
  $('total-value').textContent = eur.format(value);
  $('total-cards').textContent = String(totalCards(collection));
  const first = history[0];
  if (first && history.length > 1) {
    const diff = value - first.value;
    const node = $('total-change');
    node.textContent = `${diff >= 0 ? '+' : ''}${eur.format(diff)}`;
    node.style.color = diff >= 0 ? 'var(--gain)' : 'var(--loss)';
  }
  renderSpark();

  const empty = collection.length === 0;
  $('collection-empty').hidden = !empty;
  $('collection-wrap').hidden = empty;
  const rows = [...collection]
    .sort((a, b) => (b.price || 0) * b.qty - (a.price || 0) * a.qty)
    .map((c) => el('tr', {},
      el('td', {}, c.image ? el('img', { src: c.image, alt: '', loading: 'lazy' }) : ''),
      el('td', {}, el('b', {}, c.name), el('br'), el('small', { class: 'muted' }, GAMES[c.game] || '')),
      el('td', {}, `${c.set} #${c.number}`),
      el('td', { class: 'num' }, priceText(c.price)),
      el('td', {}, el('span', { class: 'qty' },
        el('button', { class: 'btn small', type: 'button', 'aria-label': `Quitar una ${c.name}`, onclick: () => commit(setQty(collection, c.id, c.qty - 1)) }, '−'),
        el('span', { class: 'mono' }, String(c.qty)),
        el('button', { class: 'btn small', type: 'button', 'aria-label': `Añadir una ${c.name}`, onclick: () => commit(setQty(collection, c.id, c.qty + 1)) }, '+'),
      )),
      el('td', { class: 'num' }, eur.format((c.price || 0) * c.qty)),
      el('td', {},
        c.buyUrl ? el('a', { class: 'btn small', href: c.buyUrl, target: '_blank', rel: 'noopener sponsored' }, 'Cardmarket') : '',
        ' ',
        el('button', { class: 'btn small', type: 'button', onclick: () => commit(removeCard(collection, c.id)) }, 'Eliminar'),
      ),
    ));
  $('collection-body').replaceChildren(...rows);
}

function renderResults(cards) {
  $('results').replaceChildren(...cards.map((card) => el('article', { class: 'card panel' },
    card.image ? el('img', { src: card.image, alt: card.name, loading: 'lazy' }) : el('div'),
    el('div', { class: 'meta' },
      el('b', {}, card.name),
      el('small', {}, `${card.set} · #${card.number}`),
      el('span', { class: 'price' }, priceText(card.price)),
    ),
    el('div', { class: 'actions' },
      el('button', { class: 'btn small primary', type: 'button', onclick: () => {
        commit(addCard(collection, card));
        $('collection-status').textContent = `Añadida: ${card.name}.`;
      } }, 'Añadir'),
      card.buyUrl ? el('a', { class: 'btn small', href: card.buyUrl, target: '_blank', rel: 'noopener sponsored' }, 'Comprar') : '',
      el('a', { class: 'btn small', href: amazonUrl(card), target: '_blank', rel: 'noopener sponsored' }, 'Amazon'),
    ),
  )));
}

async function runSearch(game, text) {
  const status = $('search-status');
  status.className = 'muted';
  status.textContent = 'Buscando…';
  try {
    const cards = await searchCards(game, text);
    renderResults(cards);
    status.textContent = cards.length
      ? `${cards.length} resultados para «${text}».`
      : `No hay resultados para «${text}». Prueba con el nombre en inglés.`;
  } catch (err) {
    status.className = 'notice error';
    status.textContent = err.message || 'No se pudo conectar con el servicio de precios. Revisa tu conexión.';
  }
}

async function refreshPrices() {
  const btn = $('refresh-btn');
  const status = $('collection-status');
  btn.disabled = true;
  let next = collection;
  let failed = 0;
  for (const [i, card] of collection.entries()) {
    status.textContent = `Actualizando ${i + 1} de ${collection.length}…`;
    try {
      const fresh = await fetchCard(card.id);
      if (fresh) next = updatePrice(next, card.id, fresh.price);
    } catch { failed += 1; }
    await new Promise((r) => setTimeout(r, 120)); // respeta los límites de las APIs gratuitas
  }
  commit(next);
  btn.disabled = false;
  status.textContent = failed
    ? `Precios actualizados. ${failed} cartas no respondieron; vuelve a intentarlo más tarde.`
    : 'Precios actualizados.';
}

function exportCollection() {
  const blob = new Blob([JSON.stringify({ collection, history }, null, 2)], { type: 'application/json' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `tcg-coleccion-${new Date().toISOString().slice(0, 10)}.json` });
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importCollection(file) {
  const status = $('collection-status');
  try {
    const cards = parseImport(await file.text());
    commit(cards);
    status.textContent = `Importadas ${cards.length} cartas.`;
  } catch (err) {
    status.textContent = `No se pudo importar: ${err.message}`;
  }
}

$('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  runSearch($('game-select').value, $('search-input').value);
});
$('refresh-btn').addEventListener('click', refreshPrices);
$('export-btn').addEventListener('click', exportCollection);
$('import-input').addEventListener('change', (e) => {
  if (e.target.files[0]) importCollection(e.target.files[0]);
});
if (CONFIG.donateUrl) {
  $('donate').append(el('a', { href: CONFIG.donateUrl, target: '_blank', rel: 'noopener' }, '¿Te resulta útil? Invita a un café'));
}

renderCollection();
// Primera visita: enseña resultados reales en lugar de una pantalla vacía.
$('search-input').value = 'Charizard';
runSearch('pokemon', 'Charizard');
