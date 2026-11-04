// Arranque, estado global y enrutado por hash. Cada vista exporta render(ctx) y, opcionalmente, bind(root, ctx).
import { load, save } from './core/store.js';
import * as home from './views/home.js';
import * as catalog from './views/catalog.js';
import * as unit from './views/unit.js';
import * as review from './views/review.js';
import * as errors from './views/errors.js';
import * as library from './views/library.js';
import * as portfolio from './views/portfolio.js';
import * as data from './views/data.js';
import { dueCards } from './core/srs.js';
import { weakConcepts } from './core/learning.js';

const ROUTES = {
  inicio: home,
  asignaturas: catalog,
  unidad: unit,
  repaso: review,
  errores: errors,
  biblioteca: library,
  portafolio: portfolio,
  datos: data,
};

const storage = (() => {
  try {
    const k = '__campus_test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return localStorage;
  } catch {
    return null;
  }
})();

let state = storage ? load(storage) : load({ getItem: () => null });
let saveOk = Boolean(storage);
const ui = {}; // estado transitorio de las vistas (no se guarda)

function parseHash() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const name = ROUTES[parts[0]] ? parts[0] : 'inicio';
  return { name, params: parts.slice(1) };
}

const ctx = {
  get state() {
    return state;
  },
  get saveOk() {
    return saveOk;
  },
  ui,
  storage,
  /** Sustituye el estado, lo guarda y (por defecto) vuelve a pintar la vista. */
  commit(next, { render: doRender = true } = {}) {
    state = next;
    saveOk = storage ? save(storage, state) : false;
    updateStatus();
    if (doRender) render({ keepScroll: true });
  },
  go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  },
  rerender() {
    render({ keepScroll: true });
  },
};

function updateNav(name) {
  for (const a of document.querySelectorAll('[data-nav]')) {
    a.toggleAttribute('aria-current', a.dataset.nav === name);
    if (a.dataset.nav === name) a.setAttribute('aria-current', 'page');
  }
  const due = dueCards(state.cards).length;
  const weak = weakConcepts(state).length;
  setCount('repaso', due);
  setCount('errores', weak);
}

function setCount(nav, n) {
  for (const el of document.querySelectorAll(`[data-count="${nav}"]`)) {
    el.textContent = n;
    el.hidden = n === 0;
  }
}

function updateStatus() {
  const el = document.getElementById('save-status');
  if (!el) return;
  if (!storage) el.textContent = 'Sin almacenamiento local: exporta tus datos antes de cerrar';
  else if (!saveOk) el.textContent = 'No se pudo guardar: exporta una copia';
  else el.textContent = `Guardado ${new Date(state.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  el.dataset.ok = String(saveOk);
}

function render({ keepScroll = false } = {}) {
  const { name, params } = parseHash();
  const view = ROUTES[name];
  const y = window.scrollY;
  const root = document.createElement('div');
  root.className = 'view';
  const local = Object.assign(Object.create(ctx), { params, route: name });
  try {
    root.innerHTML = view.render(local);
  } catch (err) {
    console.error(err);
    root.innerHTML = `<section class="card"><h1>Algo ha fallado</h1><p>${String(err.message)}</p><p><a href="#/inicio">Volver al inicio</a></p></section>`;
  }
  const main = document.getElementById('main');
  main.replaceChildren(root);
  view.bind?.(root, local);
  updateNav(name);
  updateStatus();
  if (keepScroll) window.scrollTo(0, y);
  else {
    window.scrollTo(0, 0);
    const h = root.querySelector('h1');
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  }
  document.title = `${root.querySelector('h1')?.textContent ?? 'Inicio'} · Campus PREMÁSTER`;
}

window.addEventListener('hashchange', () => render());
window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith('campus-premaster') && storage) {
    state = load(storage);
    render({ keepScroll: true });
  }
});
render();
