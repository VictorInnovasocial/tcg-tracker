// Planificación: minutos por semana, calendario y siguiente sesión recomendada.
import { dueCards } from './srs.js';
import { unitState } from './store.js';
import { unitProgress, weakConcepts, PASS_MARK } from './learning.js';

export const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export function localDay(d = new Date()) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

/** Lunes (00:00 local) de la semana que contiene `d`. */
export function weekStart(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export function minutesByDay(sessions) {
  const m = new Map();
  for (const s of sessions) m.set(s.date, (m.get(s.date) ?? 0) + s.minutes);
  return m;
}

export function minutesThisWeek(sessions, now = new Date()) {
  const start = localDay(weekStart(now));
  const end = new Date(weekStart(now));
  end.setDate(end.getDate() + 7);
  const endDay = localDay(end);
  return sessions.filter((s) => s.date >= start && s.date < endDay).reduce((t, s) => t + s.minutes, 0);
}

/** Rejilla de `weeks` semanas (lunes a domingo) que termina en la semana actual. */
export function calendarGrid(sessions, now = new Date(), weeks = 8) {
  const byDay = minutesByDay(sessions);
  const first = weekStart(now);
  first.setDate(first.getDate() - 7 * (weeks - 1));
  const today = localDay(now);
  const grid = [];
  for (let w = 0; w < weeks; w++) {
    const row = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() + w * 7 + i);
      const day = localDay(d);
      row.push({ day, weekday: d.getDay(), minutes: byDay.get(day) ?? 0, future: day > today, today: day === today });
    }
    grid.push(row);
  }
  return grid;
}

/** Próximo día de estudio planificado a partir de hoy (incluido). */
export function nextStudyDay(studyDays, now = new Date()) {
  if (!studyDays.length) return null;
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    if (studyDays.includes(d.getDay())) return { date: localDay(d), weekday: d.getDay(), inDays: i };
  }
  return null;
}

/**
 * Recomienda la siguiente tarea con un orden pedagógico fijo:
 * 1) tarjetas vencidas (recuperar lo olvidado antes de seguir), 2) siguiente sección,
 * 3) ejercicios, 4) test, 5) conceptos débiles, 6) reflexión, 7) actividad aplicada.
 */
export function recommend(state, unit, now = Date.now()) {
  const u = unitState(state, unit.id);
  const ids = new Set(unit.concepts.map((k) => k.id));
  const due = dueCards(state.cards, now).filter((c) => ids.has(c.id));
  if (due.length) return { kind: 'review', label: `Repasar ${due.length} tarjeta${due.length > 1 ? 's' : ''} pendiente${due.length > 1 ? 's' : ''}`, minutes: Math.min(20, 2 * due.length + 5), href: '#/repaso' };
  const sec = unit.sections.find((s) => !u.sections[s.id]);
  if (sec) return { kind: 'section', label: `Estudiar «${sec.title}»`, minutes: sec.minutes, href: `#/unidad/${unit.id}/${sec.id}` };
  const ex = unit.exercises.find((e) => !u.exercises[e.id]?.done);
  if (ex) return { kind: 'exercise', label: `Ejercicio: ${ex.title}`, minutes: ex.minutes, href: `#/unidad/${unit.id}/ejercicios` };
  const p = unitProgress(unit, u);
  if (p.quiz < PASS_MARK) return { kind: 'quiz', label: u.quizAttempts.length ? 'Repetir el test de la unidad' : 'Hacer el test de la unidad', minutes: 20, href: `#/unidad/${unit.id}/test` };
  if (weakConcepts(state, unit.id).length) return { kind: 'review', label: 'Recuperar conceptos con errores', minutes: 15, href: '#/errores' };
  if (!p.reflectionDone) return { kind: 'reflection', label: 'Escribir la reflexión de la unidad', minutes: 25, href: `#/unidad/${unit.id}/reflexion` };
  const done = state.portfolio.some((x) => x.unitId === unit.id && x.kind === 'actividad' && x.rubric && Object.values(x.rubric).every(Boolean));
  if (!done) return { kind: 'activity', label: 'Actividad aplicada: matriz de consistencia', minutes: 60, href: `#/unidad/${unit.id}/actividad` };
  return { kind: 'done', label: 'Unidad completada. Mantén el repaso espaciado.', minutes: 10, href: '#/repaso' };
}
