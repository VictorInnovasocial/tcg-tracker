// Catálogo de asignaturas vinculado al plan oficial, con registro de verificación de guías docentes.
import { esc, fmtDate, bar } from './dom.js';
import { PROGRAM, SUBJECTS, UNITS } from '../content/index.js';
import { touch, unitState } from '../core/store.js';
import { unitProgress } from '../core/learning.js';

const TYPE = { obligatoria: 'Obligatoria', optativa: 'Optativa de interés', tfm: 'Trabajo Fin de Máster' };

function guideStatus(g) {
  if (g?.url && g?.checkedAt) return `<span class="badge badge-ok">Guía consultada el ${fmtDate(g.checkedAt)}</span>`;
  return '<span class="badge badge-warn">Guía docente no verificada</span>';
}

export function render(ctx) {
  const { state } = ctx;
  const e = PROGRAM.ects;
  return `
<header class="page-head">
  <p class="eyebrow">${esc(PROGRAM.university)} · ${esc(PROGRAM.centre)}</p>
  <h1>Asignaturas</h1>
  <p class="lead">${esc(PROGRAM.name)}, especialidad ${esc(PROGRAM.specialty)}. ${esc(PROGRAM.plan)}.</p>
</header>

<section class="card">
  <h2>Estructura del plan</h2>
  <div class="ects" aria-label="Distribución de ${e.total} ECTS">
    <span style="flex:${e.mandatory}" class="ects-m">Obligatorias · ${e.mandatory}</span>
    <span style="flex:${e.optional}" class="ects-o">Optativas · ${e.optional}</span>
    <span style="flex:${e.tfm}" class="ects-t">TFM · ${e.tfm}</span>
  </div>
  <p class="muted small">${e.total} ECTS. ${esc(PROGRAM.dataStatus)}</p>
  <ul class="links">${PROGRAM.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>
  <div class="note">
    <strong>Regla de esta plataforma:</strong> mientras una asignatura no tenga su guía docente consultada y anotada aquí, sus contenidos se presentan como <em>material de preparación</em>, nunca como el programa oficial. Las optativas definitivas están por decidir.
  </div>
</section>

${SUBJECTS.map((s) => {
  const g = state.guides[s.id] ?? {};
  const units = s.units.map((id) => UNITS[id]).filter(Boolean);
  return `
<section class="card subject" id="asig-${s.id}">
  <div class="row-between">
    <div>
      <p class="eyebrow">${esc(TYPE[s.type])}</p>
      <h2>${esc(s.name)}</h2>
    </div>
    ${guideStatus(g)}
  </div>
  ${units.length ? `<ul class="unit-list">${units.map((u) => {
    const p = unitProgress(u, unitState(state, u.id));
    return `<li><a href="#/unidad/${u.id}"><span>Unidad ${u.number}. ${esc(u.title)}</span>${bar(p.pct, `Progreso unidad ${u.number}`)}<span class="muted small">${p.pct} %</span></a></li>`;
  }).join('')}</ul>` : '<p class="muted">Sin unidades todavía. Se prepararán después de validar la unidad 1 y, si es posible, con la guía docente delante.</p>'}
  <details ${g.url ? '' : ''}>
    <summary>Anotar la guía docente</summary>
    <form class="guide-form" data-guide="${s.id}">
      <label>Enlace a la guía docente oficial <input type="url" name="url" value="${esc(g.url ?? '')}" placeholder="https://…" required></label>
      <label>Fecha de consulta <input type="date" name="checkedAt" value="${esc((g.checkedAt ?? '').slice(0, 10))}" required></label>
      <label>Notas (competencias, temario, evaluación, bibliografía básica) <textarea name="notes" rows="4">${esc(g.notes ?? '')}</textarea></label>
      <div class="row"><button class="btn btn-primary" type="submit">Guardar</button>${g.url ? `<button class="btn" type="button" data-clear-guide="${s.id}">Quitar</button>` : ''}</div>
    </form>
  </details>
</section>`;
}).join('')}`;
}

export function bind(root, ctx) {
  for (const form of root.querySelectorAll('[data-guide]')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const id = form.dataset.guide;
      const guide = { url: String(f.get('url')).trim(), checkedAt: String(f.get('checkedAt')), notes: String(f.get('notes')).trim() };
      ctx.commit(touch({ ...ctx.state, guides: { ...ctx.state.guides, [id]: guide } }));
    });
  }
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-clear-guide]');
    if (!b || !confirm('¿Quitar los datos de esta guía docente?')) return;
    const guides = { ...ctx.state.guides };
    delete guides[b.dataset.clearGuide];
    ctx.commit(touch({ ...ctx.state, guides }));
  });
}
