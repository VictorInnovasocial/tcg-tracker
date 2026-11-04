// Biblioteca: fuentes académicas (separadas del material IA) con registro de lectura y notas.
import { esc, fmtDate, sourceBadge, aiBadge, uid } from './dom.js';
import { REFERENCES, READING_STATUS, UNITS } from '../content/index.js';
import { touch } from '../core/store.js';

function statusSelect(id, current) {
  return `<select data-status="${esc(id)}" aria-label="Estado de lectura">${READING_STATUS.map((s) => `<option value="${s.id}" ${s.id === (current ?? 'pendiente') ? 'selected' : ''}>${s.label}</option>`).join('')}</select>`;
}

function refCard(id, apaHtml, use, url, entry, custom = false) {
  return `<li class="ref" id="ref-${esc(id)}">
    <div class="ref-main">
      <p class="apa">${apaHtml}</p>
      ${use ? `<p class="muted small">${esc(use)}</p>` : ''}
      <div class="row">
        ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${custom ? 'Abrir enlace' : 'Buscar en catálogo'}</a>` : ''}
        ${statusSelect(id, entry?.status)}
        ${entry?.updatedAt ? `<span class="muted small">Actualizado ${fmtDate(entry.updatedAt)}</span>` : ''}
        ${custom ? `<button class="link-btn" data-del-ref="${esc(id)}">Eliminar</button>` : ''}
      </div>
      <details ${entry?.notes ? 'open' : ''}><summary>Notas de lectura</summary>
        <textarea data-notes="${esc(id)}" rows="4" placeholder="Ideas clave, páginas, citas textuales con su página…">${esc(entry?.notes ?? '')}</textarea>
      </details>
    </div>
  </li>`;
}

export function render(ctx) {
  const { state } = ctx;
  const read = Object.values(state.library).filter((e) => e.status === 'leida').length;
  const units = Object.values(UNITS);
  return `
<header class="page-head"><p class="eyebrow">Biblioteca</p><h1>Referencias académicas</h1>
<p class="lead">${read} lectura${read === 1 ? '' : 's'} terminada${read === 1 ? '' : 's'}. Cambia el estado y toma notas: se guarda solo.</p></header>

<section class="card legend">
  <p>${sourceBadge()} Obra publicada que puedes citar tras consultarla. ${aiBadge()} Texto de estudio redactado por IA: nunca se cita como fuente.</p>
  <p class="muted small">Los datos bibliográficos se redactaron sin acceso a internet. Antes de citar, comprueba la edición en el catálogo de la Biblioteca de la UEx. Los enlaces abren una búsqueda en WorldCat, no el texto completo.</p>
</section>

<section class="card">
  <h2>Fuentes de la asignatura ${sourceBadge()}</h2>
  <p class="muted small">Usadas en: ${units.map((u) => `Unidad ${u.number} (${esc(u.title)})`).join(', ')}</p>
  <ul class="refs">${REFERENCES.map((r) => refCard(r.id, r.apa, r.use, r.url, state.library[r.id])).join('')}</ul>
</section>

<section class="card">
  <h2>Mis referencias</h2>
  ${state.customRefs.length ? `<ul class="refs">${state.customRefs.map((r) => refCard(r.id, `${esc(r.authors)} (${esc(r.year || 's. f.')}). <em>${esc(r.title)}</em>${r.source ? `. ${esc(r.source)}` : ''}.`, '', r.url, state.library[r.id], true)).join('')}</ul>` : '<p class="muted">Añade artículos o libros que encuentres (Dialnet, Google Académico, catálogo UEx…).</p>'}
  <form class="ref-form" data-form="ref">
    <label>Autoría <input name="authors" placeholder="Apellido, N., y Apellido, N." required></label>
    <label>Año <input name="year" inputmode="numeric" pattern="\\d{4}" placeholder="2024"></label>
    <label class="span-2">Título <input name="title" required></label>
    <label class="span-2">Revista o editorial <input name="source" placeholder="Revista, volumen(número), páginas / Editorial"></label>
    <label class="span-2">Enlace o DOI <input name="url" type="url" placeholder="https://doi.org/…"></label>
    <button class="btn btn-primary" type="submit">Añadir referencia</button>
  </form>
</section>`;
}

export function bind(root, ctx) {
  const setEntry = (id, patch, opts) => {
    const entry = { ...(ctx.state.library[id] ?? {}), ...patch, updatedAt: new Date().toISOString() };
    ctx.commit(touch({ ...ctx.state, library: { ...ctx.state.library, [id]: entry } }), opts);
  };
  root.addEventListener('change', (e) => {
    if (e.target.dataset.status) setEntry(e.target.dataset.status, { status: e.target.value });
  });
  const timers = {};
  root.addEventListener('input', (e) => {
    const id = e.target.dataset.notes;
    if (!id) return;
    clearTimeout(timers[id]);
    const v = e.target.value;
    timers[id] = setTimeout(() => setEntry(id, { notes: v }, { render: false }), 500);
  });
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-del-ref]');
    if (!b || !confirm('¿Eliminar esta referencia y sus notas?')) return;
    const id = b.dataset.delRef;
    const library = { ...ctx.state.library };
    delete library[id];
    ctx.commit(touch({ ...ctx.state, library, customRefs: ctx.state.customRefs.filter((r) => r.id !== id) }));
  });
  root.querySelector('[data-form="ref"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const ref = { id: `mi-${uid()}`, authors: f.authors.trim(), year: f.year.trim(), title: f.title.trim(), source: f.source.trim(), url: f.url.trim() };
    ctx.commit(touch({ ...ctx.state, customRefs: [...ctx.state.customRefs, ref] }));
  });
}
