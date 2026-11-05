// Repaso espaciado: hay que escribir la respuesta de memoria antes de poder ver la solución.
import { esc, fmtDate, bar } from './dom.js';
import { CONCEPTS } from '../content/index.js';
import { dueCards, review as schedule, GRADES, mastery } from '../core/srs.js';
import { reviewConcept } from '../core/learning.js';

const MIN_CHARS = 15;
const GRADE_UI = [
  { g: GRADES.AGAIN, label: 'No lo recordaba', cls: 'g0' },
  { g: GRADES.HARD, label: 'Con mucho esfuerzo', cls: 'g1' },
  { g: GRADES.GOOD, label: 'Bien', cls: 'g2' },
  { g: GRADES.EASY, label: 'Fácil', cls: 'g3' },
];

function when(ms) {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const days = Math.round(ms / 86400000);
  return days <= 1 ? '1 día' : `${days} días`;
}

export function render(ctx) {
  const { state, ui } = ctx;
  const now = Date.now();
  const due = dueCards(state.cards, now).filter((c) => CONCEPTS[c.id]);
  const r = (ui.review ??= { text: '', revealed: false, done: 0 });
  const all = Object.values(state.cards).filter((c) => CONCEPTS[c.id]).sort((a, b) => a.due - b.due);
  const upcoming = all.filter((c) => c.due > now);

  const head = `<header class="page-head"><p class="eyebrow">Repaso espaciado · práctica de recuperación</p><h1>Repaso</h1>
  <p class="lead">Las tarjetas aparecen cuando estás a punto de olvidarlas. Primero escribes lo que recuerdas; solo entonces ves la respuesta y valoras tu recuerdo.</p></header>`;

  if (!due.length) {
    return `${head}
<section class="card">
  <h2>${r.done ? `Hecho: ${r.done} tarjeta${r.done > 1 ? 's' : ''} repasada${r.done > 1 ? 's' : ''}` : 'No hay tarjetas pendientes'}</h2>
  <p>${upcoming.length ? `La próxima tarjeta vence el <strong>${fmtDate(upcoming[0].due)}</strong>.` : 'Las tarjetas se crean cuando completas la recuperación de memoria de cada sección, o cuando fallas un concepto.'}</p>
  ${all.length ? '' : '<p><a class="btn btn-primary" href="#iics-u1-s1">Ir a la sección 1</a></p>'}
</section>
${all.length ? `<section class="card"><h2>Estado de tus conceptos</h2>
<table class="table"><thead><tr><th>Concepto</th><th>Dominio</th><th>Próximo repaso</th></tr></thead><tbody>
${all.map((c) => `<tr><td><a href="#${CONCEPTS[c.id].unitId}-${CONCEPTS[c.id].sectionId}">${esc(CONCEPTS[c.id].term)}</a></td><td>${bar(mastery(c) * 100, 'Dominio')}</td><td>${fmtDate(c.due)}</td></tr>`).join('')}
</tbody></table><p class="muted small">El dominio se alcanza al llegar a intervalos de unas tres semanas sin olvidar.</p></section>` : ''}`;
  }

  const card = due[0];
  const c = CONCEPTS[card.id];
  const preview = GRADE_UI.map((x) => ({ ...x, next: schedule(card, x.g, now).due - now }));
  const errors = state.errors.filter((e) => e.conceptId === card.id && !e.resolved).length;
  return `${head}
<p class="muted">${due.length} pendiente${due.length > 1 ? 's' : ''}${r.done ? ` · ${r.done} hecha${r.done > 1 ? 's' : ''} en esta sesión` : ''}</p>
<section class="card flash">
  <p class="eyebrow">${esc(c.term)}${errors ? ` · <span class="ko">${errors} error${errors > 1 ? 'es' : ''} abierto${errors > 1 ? 's' : ''}</span>` : ''}</p>
  <h2>${esc(c.front)}</h2>
  ${r.revealed ? `
  <div class="compare">
    <div><h3>Lo que recordaste</h3><p class="answer">${esc(r.text)}</p></div>
    <div><h3>Respuesta</h3><p>${esc(c.back)}</p></div>
  </div>
  <p><strong>Compara con honestidad. ¿Cómo ha sido tu recuerdo?</strong></p>
  <div class="grades">${(r.blank ? preview.filter((x) => x.g === GRADES.AGAIN) : preview).map((x) => `<button class="btn grade ${x.cls}" data-grade="${x.g}">${esc(x.label)}<small>vuelve en ${when(x.next)}</small></button>`).join('')}</div>
  <p class="muted small">«Bien» o «Fácil» cierran los errores abiertos de este concepto.</p>` : `
  <textarea data-answer rows="5" aria-label="Tu respuesta de memoria" placeholder="Escribe lo que recuerdes, aunque sea incompleto…">${esc(r.text)}</textarea>
  <p class="muted small"><span data-count>${r.text.trim().length}</span>/${MIN_CHARS} caracteres para poder ver la respuesta</p>
  <div class="row">
    <button class="btn btn-primary" data-action="reveal" ${r.text.trim().length < MIN_CHARS ? 'disabled' : ''}>Ver la respuesta</button>
    <button class="btn" data-action="blank">No recuerdo nada</button>
  </div>`}
  <p class="muted small"><a href="#${c.unitId}-${c.sectionId}">Estudiar de nuevo esta sección</a> (después de intentarlo).</p>
</section>`;
}

export function bind(root, ctx) {
  const r = ctx.ui.review;
  root.querySelector('[data-answer]')?.addEventListener('input', (e) => {
    r.text = e.target.value;
    root.querySelector('[data-count]').textContent = r.text.trim().length;
    root.querySelector('[data-action="reveal"]').disabled = r.text.trim().length < MIN_CHARS;
  });
  root.querySelector('[data-answer]')?.focus({ preventScroll: true });
  root.addEventListener('click', (e) => {
    const act = e.target.closest('[data-action]')?.dataset.action;
    if (act === 'reveal') {
      r.revealed = true;
      ctx.rerender();
    }
    if (act === 'blank') {
      r.text = '(No recordaba nada)';
      r.blank = true;
      r.revealed = true;
      ctx.rerender();
    }
    const g = e.target.closest('[data-grade]');
    if (g) {
      const card = dueCards(ctx.state.cards).filter((c) => CONCEPTS[c.id])[0];
      if (!card) return;
      const grade = r.blank ? GRADES.AGAIN : Number(g.dataset.grade);
      r.text = '';
      r.blank = false;
      r.revealed = false;
      r.done += 1;
      ctx.commit(reviewConcept(ctx.state, card.id, grade));
    }
  });
}
