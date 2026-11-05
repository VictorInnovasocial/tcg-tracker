// Historial de errores y conceptos a recuperar.
import { esc, fmtDate } from './dom.js';
import { CONCEPTS } from '../content/index.js';
import { weakConcepts } from '../core/learning.js';

const SOURCE = (s) => {
  const [kind, id] = String(s).split(':');
  return { test: `Test (${id})`, ejercicio: `Ejercicio ${id}`, 'recuperación': `Recuperación ${id}` }[kind] ?? s;
};

export function render(ctx) {
  const { state } = ctx;
  const weak = weakConcepts(state);
  const history = [...state.errors].reverse();
  return `
<header class="page-head"><p class="eyebrow">Diagnóstico</p><h1>Errores y dificultades</h1>
<p class="lead">Cada fallo se anota aquí y obliga a recuperar el concepto en el repaso. Un error se cierra cuando, más tarde, recuerdas el concepto correctamente («Bien» o «Fácil»).</p></header>

<section class="card">
  <h2>Conceptos que debes recuperar</h2>
  ${weak.length ? `<ul class="weak">${weak.map((w) => {
    const c = CONCEPTS[w.conceptId];
    return `<li><span><strong>${esc(c?.term ?? w.conceptId)}</strong> · ${w.count} fallo${w.count > 1 ? 's' : ''} sin resolver</span>${c ? `<a href="#${c.unitId}-${c.sectionId}">Volver a la sección</a>` : ''}</li>`;
  }).join('')}</ul><p><a class="btn btn-primary" href="#repaso">Recuperarlos en el repaso</a></p>` : '<p>No tienes errores abiertos.</p>'}
</section>

<section class="card">
  <h2>Historial completo</h2>
  ${history.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Fecha</th><th>Concepto</th><th>Dónde</th><th>Detalle</th><th>Estado</th></tr></thead><tbody>
  ${history.map((e) => `<tr><td>${fmtDate(e.at)}</td><td>${esc(CONCEPTS[e.conceptId]?.term ?? e.conceptId)}</td><td>${esc(SOURCE(e.source))}</td><td class="small">${esc(e.detail)}</td><td>${e.resolved ? `<span class="badge badge-ok">Resuelto ${fmtDate(e.resolvedAt)}</span>` : '<span class="badge badge-ko">Abierto</span>'}</td></tr>`).join('')}
  </tbody></table></div>` : '<p class="muted">Aún no hay registros.</p>'}
</section>`;
}
