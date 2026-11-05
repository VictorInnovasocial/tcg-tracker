// Portafolio: entregables guardados desde las unidades, descargables como texto.
import { esc, fmtDate, download, ask, inFrame, copyText } from './dom.js';
import { UNITS } from '../content/index.js';
import { touch } from '../core/store.js';

const KIND = { actividad: 'Actividad aplicada', ejercicio: 'Ejercicio', reflexion: 'Reflexión' };

export function toMarkdown(item) {
  const lines = [`# ${item.title}`, '', `${KIND[item.kind] ?? item.kind} · ${UNITS[item.unitId]?.title ?? ''}`, `Última versión: ${new Date(item.updatedAt).toLocaleString('es-ES')}`, ''];
  for (const [k, v] of Object.entries(item.fields ?? {})) lines.push(`## ${k}`, '', v || '_(vacío)_', '');
  if (item.rubric) {
    lines.push('## Autoevaluación', '');
    for (const [id, ok] of Object.entries(item.rubric)) lines.push(`- [${ok ? 'x' : ' '}] ${item.rubricLabels?.[id] ?? id}`);
    lines.push('');
  }
  return lines.join('\n');
}

export function render(ctx) {
  const items = [...ctx.state.portfolio].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return `
<header class="page-head"><p class="eyebrow">Portafolio</p><h1>Entregables y proyectos</h1>
<p class="lead">Aquí se guardan tus actividades aplicadas, ejercicios abiertos y reflexiones. Son tuyos: puedes descargarlos y llevarlos a una tutoría.</p></header>
${items.length ? items.map((it) => {
  const rub = it.rubric ? Object.values(it.rubric) : null;
  return `<section class="card portfolio-item">
  <div class="row-between">
    <div><p class="eyebrow">${esc(KIND[it.kind] ?? it.kind)} · ${fmtDate(it.updatedAt)}</p><h2>${esc(it.title)}</h2></div>
    ${rub ? `<span class="badge ${rub.every(Boolean) ? 'badge-ok' : 'badge-warn'}">Rúbrica ${rub.filter(Boolean).length}/${rub.length}</span>` : ''}
  </div>
  <details><summary>Ver contenido</summary>
    <dl>${Object.entries(it.fields ?? {}).map(([k, v]) => `<dt>${esc(k)}</dt><dd class="answer">${esc(v) || '<span class="muted">(vacío)</span>'}</dd>`).join('')}</dl>
  </details>
  <div class="row">
    <button class="btn" data-copy="${esc(it.id)}">Copiar texto</button>
    ${inFrame ? '' : `<button class="btn" data-dl="${esc(it.id)}">Descargar (.md)</button>`}
    ${it.kind === 'actividad' ? `<a href="#${it.unitId}-actividad">Editar</a>` : it.kind === 'reflexion' ? `<a href="#${it.unitId}-reflexion">Editar</a>` : ''}
    <button class="link-btn" data-del="${esc(it.id)}">Eliminar</button>
  </div>
</section>`;
}).join('') : '<section class="card"><p>Todavía no hay entregables. El primero es la <a href="#iics-u1-actividad">matriz de consistencia</a> de la unidad 1.</p></section>'}`;
}

export function bind(root, ctx) {
  root.addEventListener('click', async (e) => {
    const cp = e.target.closest('[data-copy]');
    if (cp) {
      const it = ctx.state.portfolio.find((p) => p.id === cp.dataset.copy);
      if (it) cp.textContent = (await copyText(toMarkdown(it))) ? 'Copiado' : 'No se pudo copiar';
    }
    const dl = e.target.closest('[data-dl]');
    if (dl) {
      const it = ctx.state.portfolio.find((p) => p.id === dl.dataset.dl);
      if (it) download(`${it.id}.md`, toMarkdown(it), 'text/markdown');
    }
    const del = e.target.closest('[data-del]');
    if (del && (await ask('¿Eliminar este entregable del portafolio? No se puede deshacer, salvo que tengas una copia exportada.', { confirmLabel: 'Eliminar', danger: true }))) {
      ctx.commit(touch({ ...ctx.state, portfolio: ctx.state.portfolio.filter((p) => p.id !== del.dataset.del) }));
    }
  });
}
