// Datos y ajustes: exportar, importar, restablecer; meta semanal y días de estudio.
import { esc, fmtDate, download, ask, inFrame, copyText } from './dom.js';
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
    ${inFrame ? '' : '<button class="btn btn-primary" data-action="export">Descargar copia (JSON)</button>'}
    <button class="btn ${inFrame ? 'btn-primary' : ''}" data-action="copy">Copiar copia al portapapeles</button>
    <label class="btn file-btn">Importar archivo… <input type="file" accept="application/json,.json" data-import hidden></label>
  </div>
  <details>
    <summary>Pegar una copia como texto</summary>
    <label for="paste-json">Pega aquí el texto JSON exportado
      <textarea id="paste-json" rows="5" data-paste spellcheck="false"></textarea>
    </label>
    <button class="btn" data-action="paste">Importar el texto pegado</button>
  </details>
  <textarea class="export-box" rows="5" readonly data-export-box hidden aria-label="Copia de tus datos en JSON"></textarea>
  <p class="muted small">Importar <strong>sustituye</strong> todo el progreso actual por el de la copia. Para usar la plataforma en otro dispositivo o navegador, copia o descarga aquí e importa allí. Guarda el texto copiado en un archivo o una nota.</p>
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
  const say = (text, ok = true) => {
    msg.textContent = text;
    msg.className = ok ? 'ok' : 'ko';
  };
  async function importText(text) {
    try {
      const next = parseImport(text);
      const summary = `${next.sessions.length} sesiones, ${Object.keys(next.cards).length} tarjetas y ${next.portfolio.length} entregables (última modificación: ${fmtDate(next.updatedAt)})`;
      if (!(await ask(`La copia contiene ${summary}. ¿Sustituir tu progreso actual?`, { confirmLabel: 'Sustituir', danger: true }))) return;
      ctx.ui.flash = 'Copia importada correctamente.';
      ctx.commit(next);
    } catch (err) {
      say(err.message, false);
    }
  }
  root.addEventListener('click', async (e) => {
    const a = e.target.closest('[data-action]')?.dataset.action;
    if (a === 'export') {
      download(`campus-premaster-${localDay()}.json`, exportJSON(ctx.state));
      say('Copia descargada.');
    }
    if (a === 'copy') {
      const box = root.querySelector('[data-export-box]');
      box.value = exportJSON(ctx.state);
      box.hidden = false;
      const ok = await copyText(box.value, box);
      say(ok ? 'Copia copiada al portapapeles. Pégala en un archivo o una nota para guardarla.' : 'No se pudo copiar automáticamente: el texto está seleccionado abajo, cópialo a mano.', ok);
    }
    if (a === 'paste') {
      const text = root.querySelector('[data-paste]').value.trim();
      if (!text) return say('Pega primero el texto de una copia.', false);
      importText(text);
    }
    if (a === 'reset') {
      if (!(await ask('Se borrará todo el progreso de este navegador.', { confirmLabel: 'Borrar todo', danger: true, requireText: 'BORRAR' }))) return;
      ctx.ui.flash = 'Datos borrados.';
      ctx.commit(emptyState());
    }
  });
  root.querySelector('[data-import]').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    e.target.value = '';
    importText(text);
  });
  root.querySelector('[data-form="settings"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const goal = Math.round(Number(f.get('goal')));
    const days = f.getAll('day').map(Number);
    ctx.commit(touch({ ...ctx.state, settings: { weeklyGoalMinutes: goal > 0 ? goal : 210, studyDays: days.sort() } }));
  });
  if (ctx.ui.flash) {
    say(ctx.ui.flash);
    ctx.ui.flash = null;
  }
}
