// Panel de inicio: próxima sesión recomendada, semana en curso, calendario y registro de sesiones.
import { esc, bar, fmtDay, fmtMinutes, ask } from './dom.js';
import { UNITS, PROGRAM } from '../content/index.js';
import { recommend, minutesThisWeek, calendarGrid, nextStudyDay, localDay, DAY_NAMES } from '../core/planner.js';
import { unitProgress, weakConcepts } from '../core/learning.js';
import { unitState, touch } from '../core/store.js';
import { dueCards } from '../core/srs.js';

const TIMER_KEY = 'campus-premaster:timer';

function timerStart(storage) {
  try {
    const v = Number(storage?.getItem(TIMER_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

function heat(minutes) {
  if (!minutes) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 90) return 3;
  return 4;
}

export function render(ctx) {
  const { state } = ctx;
  const unit = Object.values(UNITS)[0];
  const rec = recommend(state, unit);
  const prog = unitProgress(unit, unitState(state, unit.id));
  const week = minutesThisWeek(state.sessions);
  const goal = state.settings.weeklyGoalMinutes;
  const next = nextStudyDay(state.settings.studyDays);
  const due = dueCards(state.cards).length;
  const weak = weakConcepts(state).length;
  const grid = calendarGrid(state.sessions, new Date(), 10);
  const started = timerStart(ctx.storage);
  const recent = [...state.sessions].map((s, i) => ({ ...s, i })).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);

  const nextLabel = !next ? 'Sin días de estudio configurados' : next.inDays === 0 ? 'Hoy' : next.inDays === 1 ? 'Mañana' : `El ${DAY_NAMES[next.weekday]}`;

  return `
<header class="page-head">
  <p class="eyebrow">${esc(PROGRAM.specialty)} · objetivo curso ${esc(PROGRAM.targetYear)}</p>
  <h1>Panel de estudio</h1>
</header>

<section class="card next-card">
  <div>
    <p class="eyebrow">Próxima tarea recomendada</p>
    <h2>${esc(rec.label)}</h2>
    <p class="muted">Unos ${rec.minutes} min · ${esc(unit.title)}</p>
    <p class="muted small">El orden es fijo: primero lo que toca repasar, después lo nuevo. Recuperar antes de avanzar es lo que consolida.</p>
  </div>
  <a class="btn btn-primary" href="${rec.href}">Empezar</a>
</section>

<div class="grid-3">
  <section class="card stat">
    <p class="eyebrow">Esta semana</p>
    <p class="stat-num">${fmtMinutes(week)} <span class="muted">/ ${fmtMinutes(goal)}</span></p>
    ${bar((week / goal) * 100, 'Minutos de esta semana')}
    <p class="muted small">Próxima sesión planificada: <strong>${esc(nextLabel)}</strong></p>
  </section>
  <section class="card stat">
    <p class="eyebrow">Unidad 1</p>
    <p class="stat-num">${prog.pct} %</p>
    ${bar(prog.pct, 'Progreso de la unidad 1')}
    <p class="muted small">${prog.secDone}/${prog.secTotal} secciones · ${prog.exDone}/${prog.exTotal} ejercicios · test ${prog.quiz ? `${Math.round(prog.quiz * 100)} %` : 'sin hacer'}</p>
  </section>
  <section class="card stat">
    <p class="eyebrow">Memoria</p>
    <p class="stat-num">${due} <span class="muted small">tarjetas para hoy</span></p>
    <p class="muted small"><a href="#errores">${weak} concepto${weak === 1 ? '' : 's'} con errores abiertos</a></p>
    <p><a href="#repaso">Ir al repaso</a></p>
  </section>
</div>

<section class="card">
  <div class="row-between">
    <h2>Registro de estudio</h2>
    <div class="timer">
      ${started ? `<span class="muted small" data-timer="${started}">En curso</span> <button class="btn" data-action="timer-stop">Terminar sesión</button>` : '<button class="btn" data-action="timer-start">Iniciar cronómetro</button>'}
    </div>
  </div>
  <form class="session-form" data-form="session">
    <label>Fecha <input type="date" name="date" value="${localDay()}" max="${localDay()}" required></label>
    <label>Minutos <input type="number" name="minutes" min="5" max="600" step="5" value="${esc(ctx.ui.timerMinutes ?? 45)}" required></label>
    <label class="grow">Qué he hecho <input type="text" name="note" maxlength="200" placeholder="p. ej., sección 2 y tarjetas"></label>
    <button class="btn btn-primary" type="submit">Registrar sesión</button>
  </form>

  <div class="heatmap" aria-label="Minutos de estudio de las últimas 10 semanas">
    <div class="heat-days" aria-hidden="true"><span>L</span><span></span><span>X</span><span></span><span>V</span><span></span><span>D</span></div>
    ${grid.map((week) => `<div class="heat-col">${week.map((d) => `<span class="heat h${heat(d.minutes)}${d.today ? ' today' : ''}${d.future ? ' future' : ''}${state.settings.studyDays.includes(d.weekday) ? ' planned' : ''}" title="${fmtDay(d.day)}: ${d.minutes} min"></span>`).join('')}</div>`).join('')}
  </div>
  <p class="muted small">Cada columna es una semana (de lunes a domingo). Borde punteado: día de estudio planificado. Cambia los días y la meta semanal en <a href="#datos">Datos y ajustes</a>.</p>

  ${recent.length ? `<ul class="session-list">${recent.map((s) => `<li><span>${fmtDay(s.date)} · <strong>${fmtMinutes(s.minutes)}</strong>${s.note ? ` · ${esc(s.note)}` : ''}</span><button class="link-btn" data-action="del-session" data-i="${s.i}" aria-label="Borrar sesión del ${fmtDay(s.date)}">Borrar</button></li>`).join('')}</ul>` : '<p class="muted">Todavía no has registrado ninguna sesión.</p>'}
</section>`;
}

export function bind(root, ctx) {
  root.querySelector('[data-form="session"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const minutes = Math.round(Number(f.get('minutes')));
    if (!(minutes > 0)) return;
    ctx.ui.timerMinutes = undefined;
    ctx.commit(touch({ ...ctx.state, sessions: [...ctx.state.sessions, { date: String(f.get('date')), minutes, note: String(f.get('note') || '').trim() }] }));
  });
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const a = btn.dataset.action;
    if (a === 'del-session') {
      const i = Number(btn.dataset.i);
      if (!(await ask('¿Borrar esta sesión del registro?', { confirmLabel: 'Borrar', danger: true }))) return;
      ctx.commit(touch({ ...ctx.state, sessions: ctx.state.sessions.filter((_, j) => j !== i) }));
    }
    if (a === 'timer-start') {
      try {
        ctx.storage?.setItem(TIMER_KEY, String(Date.now()));
      } catch {}
      ctx.rerender();
    }
    if (a === 'timer-stop') {
      const start = timerStart(ctx.storage);
      try {
        ctx.storage?.removeItem(TIMER_KEY);
      } catch {}
      if (start) ctx.ui.timerMinutes = Math.max(5, Math.round((Date.now() - start) / 60000 / 5) * 5);
      ctx.rerender();
      root.ownerDocument.querySelector('[data-form="session"] [name="note"]')?.focus();
    }
  });
  const t = root.querySelector('[data-timer]');
  if (t) {
    const start = Number(t.dataset.timer);
    const tick = () => {
      if (!t.isConnected) return clearInterval(id);
      const m = Math.floor((Date.now() - start) / 60000);
      t.textContent = `En curso: ${fmtMinutes(m)}`;
    };
    const id = setInterval(tick, 15000);
    tick();
  }
}
