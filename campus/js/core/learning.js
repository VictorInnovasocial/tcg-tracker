// Lógica de aprendizaje: corrección de tests, historial de errores, progreso de unidad.
import { newCard, forceDue, review, GRADES } from './srs.js';
import { touch, unitState } from './store.js';

export const PASS_MARK = 0.75; // 75 % para dar el test por superado

/**
 * Cada pregunta admite dos intentos: si el primero falla, el estudiante lee por qué
 * su opción no es correcta y vuelve a intentarlo antes de ver la solución.
 * 1 punto al primer intento, 0,5 al segundo, 0 si falla ambos.
 */
export function gradeAnswer(question, first, second = null) {
  const firstCorrect = first === question.correct;
  const finalCorrect = firstCorrect || second === question.correct;
  const points = firstCorrect ? 1 : finalCorrect ? 0.5 : 0;
  return { firstCorrect, finalCorrect, points };
}

export function scoreAttempt(questions, answers) {
  let points = 0;
  const failedConcepts = new Set();
  const answered = questions.filter((q) => answers[q.id]?.first != null);
  for (const q of answered) {
    const a = answers[q.id];
    const g = gradeAnswer(q, a.first, a.second ?? null);
    points += g.points;
    if (!g.firstCorrect) failedConcepts.add(q.conceptId);
  }
  const max = questions.length;
  return { points, max, pct: max ? points / max : 0, passed: max ? points / max >= PASS_MARK : false, failedConcepts: [...failedConcepts], complete: answered.length === max };
}

function ensureCard(cards, conceptId, now) {
  return cards[conceptId] ?? newCard(conceptId, now);
}

/** Registra un error y obliga a recuperar el concepto en el siguiente repaso. */
export function logError(state, { unitId, conceptId, source, detail }, now = Date.now()) {
  const card = forceDue(ensureCard(state.cards, conceptId, now), now);
  const errors = [...state.errors, { at: new Date(now).toISOString(), unitId, conceptId, source, detail: String(detail ?? '').slice(0, 300), resolved: false }];
  return touch({ ...state, errors, cards: { ...state.cards, [conceptId]: card } });
}

export function applyQuizResult(state, unitId, questions, answers, now = Date.now()) {
  const result = scoreAttempt(questions, answers);
  let next = state;
  for (const q of questions) {
    const a = answers[q.id];
    if (a && a.first !== q.correct) {
      next = logError(next, { unitId, conceptId: q.conceptId, source: `test:${q.id}`, detail: q.stem }, now);
    }
  }
  const u = unitState(next, unitId);
  const attempt = { at: new Date(now).toISOString(), points: result.points, max: result.max, answers };
  next = { ...next, units: { ...next.units, [unitId]: { ...u, quizAttempts: [...u.quizAttempts, attempt] } } };
  return { state: touch(next), result };
}

/** Repaso de una tarjeta. Un recuerdo correcto (bien/fácil) cierra los errores abiertos del concepto. */
export function reviewConcept(state, conceptId, grade, now = Date.now()) {
  const card = review(ensureCard(state.cards, conceptId, now), grade, now);
  const resolves = grade >= GRADES.GOOD;
  const errors = resolves ? state.errors.map((e) => (e.conceptId === conceptId && !e.resolved ? { ...e, resolved: true, resolvedAt: new Date(now).toISOString() } : e)) : state.errors;
  return touch({ ...state, cards: { ...state.cards, [conceptId]: card }, errors });
}

/**
 * Da de alta las tarjetas de unos conceptos (sin pisar las existentes).
 * Por defecto vencen al día siguiente: el primer repaso llega cuando ya ha habido algo de olvido.
 */
export function seedCards(state, conceptIds, now = Date.now(), delayMs = 24 * 60 * 60 * 1000) {
  const cards = { ...state.cards };
  let changed = false;
  for (const id of conceptIds) {
    if (!cards[id]) {
      cards[id] = { ...newCard(id, now), due: now + delayMs };
      changed = true;
    }
  }
  return changed ? { ...state, cards } : state;
}

/** Conceptos con errores sin resolver, de más a menos fallos. */
export function weakConcepts(state, unitId = null) {
  const counts = new Map();
  for (const e of state.errors) {
    if (e.resolved || (unitId && e.unitId !== unitId)) continue;
    counts.set(e.conceptId, (counts.get(e.conceptId) ?? 0) + 1);
  }
  return [...counts.entries()].map(([conceptId, count]) => ({ conceptId, count })).sort((a, b) => b.count - a.count);
}

export function bestQuiz(u) {
  return u.quizAttempts.reduce((best, a) => Math.max(best, a.max ? a.points / a.max : 0), 0);
}

/**
 * Progreso ponderado de una unidad: secciones 40 %, ejercicios 25 %, test 25 %, reflexión 10 %.
 * Una sección solo cuenta si se ha hecho su recuperación de memoria.
 */
export function unitProgress(unit, u) {
  const secTotal = unit.sections.length;
  const secDone = unit.sections.filter((s) => u.sections[s.id]).length;
  const exTotal = unit.exercises.length;
  const exDone = unit.exercises.filter((e) => u.exercises[e.id]?.done).length;
  const quiz = bestQuiz(u);
  const reflectionDone = u.reflection.trim().length >= 200;
  const pct = 0.4 * (secTotal ? secDone / secTotal : 0) + 0.25 * (exTotal ? exDone / exTotal : 0) + 0.25 * Math.min(1, quiz / PASS_MARK) + 0.1 * (reflectionDone ? 1 : 0);
  return { secDone, secTotal, exDone, exTotal, quiz, quizPassed: quiz >= PASS_MARK, reflectionDone, pct: Math.round(pct * 100) };
}
