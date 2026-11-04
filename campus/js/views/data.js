// Datos y ajustes: exportar, importar, restablecer; meta semanal y días de estudio.
import { esc, fmtDate, download } from './dom.js';
import { exportJSON, parseImport, emptyState, touch } from '../core/store.js';
import { DAY_NAMES, localDay } from '../core/planner.js';

const ORDER = [1, 2, 3, 4, 5, 6, 0];

export function render(ctx) {
  const { state } = ctx;
  const s = state.settings;
  const counts = `${state.sessions.length} sesiones · ${Object.keys(state.cards).length} tarjetas · ${state.errors.length} errores registrados · ${state.portfolio.length} entregables`;
  return `
<header class="page-head"><p class="eyebrow">Tus datos</p><h1>Datos y ajustes</h1>
<p class="lead">Todo se guarda solo en este navegador y en este dispositivo. No hay servidor ni cuenta: exporta una copia con regularidad.</p></header>

<section class="card">
  <h2>Copia de seguridad</h2>
  <p class="muted small">${counts}. Datos creados el ${fmtDate(state.createdAt)}.</p>
  ${ctx.saveOk ? '' : '<p class="ko"><strong>Atención:</strong> este navegador no está guardando los datos (modo privado o almacenamiento bloqueado). Exporta antes de cerrar.</p>'}
  <div class="row">
    <button class="btn btn-primary" data-action="export">Exportar (JSON)</button>
    <label class="btn file-btn">Importar copia… <input type="file" accept="application/json,.json" data-import hidden></label>
  </div>
  <p class="muted small">Importar <strong>sustituye</strong> todo el progreso actual por el de la copia. Para usar la plataforma en otro dispositivo, exporta aquí e importa allí.</p>
  <p data-msg role="status"></p>
</section>

<section class="card">
  <h2>Plan semanal</h2>
  <form data-form="settings" class="settings">
    <label>Meta semanal (minutos) <input type="number" name="goal" min="30" max="1200" step="15" value="${s.weeklyGoalMinutes}" required></label>
    <fieldset><legend>Días de estudio</legend>
      <div class="days">${ORDER.map((d) => `<label class="day"><input type="checkbox" name="day" value="${d}" ${s.studyDays.includes(d) ? 'checked' : ''}> ${DAY_NAMES[d]}</label>`).join('')}</div>
    </fieldset>
    <p class="muted small">Con 3–4 horas semanales y jornada de 8:00 a 15:00, funcionan bien dos sesiones de tarde de 60–75 min y una más larga el fin de semana.</p>
    <button class="btn btn-primary" type="submit">Guardar ajustes</button>
  </form>
</section>

<section class="card danger">
  <h2>Restablecer</h2>
  <p>Borra todo el progreso de este navegador. Exporta antes una copia si la quieres conservar.</p>
  <button class="btn btn-danger" data-action="reset">Borrar todos los datos</button>
</section>`;
}

export function bind(root, ctx) {
  const msg = root.querySelector('[data-msg]');
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]')?.dataset.action;
    if (a === 'export') {
      download(`campus-premaster-${localDay()}.json`, exportJSON(ctx.state));
      msg.textContent = 'Copia descargada.';
    }
    if (a === 'reset') {
      if (!confirm('¿Borrar TODO el progreso de este navegador?')) return;
      if (prompt('Escribe BORRAR para confirmar') !== 'BORRAR') return;
      ctx.commit(emptyState());
    }
  });
  root.querySelector('[data-import]').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const next = parseImport(await file.text());
      const summary = `${next.sessions.length} sesiones, ${Object.keys(next.cards).length} tarjetas y ${next.portfolio.length} entregables (última modificación: ${fmtDate(next.updatedAt)})`;
      if (!confirm(`La copia contiene ${summary}. ¿Sustituir tu progreso actual?`)) return;
      ctx.ui.flash = 'Copia importada correctamente.';
      ctx.commit(next);
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'ko';
    } finally {
      e.target.value = '';
    }
  });
  root.querySelector('[data-form="settings"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const goal = Math.round(Number(f.get('goal')));
    const days = f.getAll('day').map(Number);
    ctx.commit(touch({ ...ctx.state, settings: { weeklyGoalMinutes: goal > 0 ? goal : 210, studyDays: days.sort() } }));
  });
  if (ctx.ui.flash) {
    msg.textContent = ctx.ui.flash;
    ctx.ui.flash = null;
  }
}
