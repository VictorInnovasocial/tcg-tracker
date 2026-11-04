import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newCard, review, GRADES, dueCards, forceDue } from '../campus/js/core/srs.js';
import { emptyState, normalize, exportJSON, parseImport, updateUnit, unitState, load, save } from '../campus/js/core/store.js';
import { gradeAnswer, scoreAttempt, applyQuizResult, reviewConcept, weakConcepts, unitProgress, seedCards } from '../campus/js/core/learning.js';
import { weekStart, localDay, minutesThisWeek, calendarGrid, nextStudyDay, recommend } from '../campus/js/core/planner.js';
import { UNIT } from '../campus/js/content/iics-u1.js';

const DAY = 86400000;
const T0 = Date.parse('2026-11-04T10:00:00');

test('SRS: olvidar reinicia, recordar alarga el intervalo', () => {
  let c = newCard('k', T0);
  c = review(c, GRADES.GOOD, T0);
  assert.equal(c.interval, 1);
  c = review(c, GRADES.GOOD, T0 + DAY);
  assert.equal(c.interval, 6);
  c = review(c, GRADES.GOOD, T0 + 7 * DAY);
  assert.equal(c.interval, 15);
  const lapsed = review(c, GRADES.AGAIN, T0 + 30 * DAY);
  assert.equal(lapsed.reps, 0);
  assert.equal(lapsed.lapses, 1);
  assert.ok(lapsed.ease < c.ease);
  assert.ok(lapsed.due - (T0 + 30 * DAY) < DAY);
  assert.throws(() => review(c, 7, T0));
});

test('SRS: forceDue pone la tarjeta para hoy y dueCards la devuelve', () => {
  const c = review(newCard('k', T0), GRADES.EASY, T0);
  assert.equal(dueCards({ k: c }, T0 + DAY).length, 0);
  assert.equal(dueCards({ k: forceDue(c, T0 + DAY) }, T0 + DAY).length, 1);
});

test('store: normalize descarta datos inválidos y conserva los válidos', () => {
  const s = normalize({ settings: { weeklyGoalMinutes: -5, studyDays: [1, 1, 9, 3] }, sessions: [{ date: '2026-11-04', minutes: 30 }, { date: 'x', minutes: 10 }], cards: { a: { due: 1, ease: 2.5 }, b: 'no' } });
  assert.equal(s.settings.weeklyGoalMinutes, 210);
  assert.deepEqual(s.settings.studyDays, [1, 3]);
  assert.equal(s.sessions.length, 1);
  assert.deepEqual(Object.keys(s.cards), ['a']);
});

test('store: exportar e importar conserva el progreso', () => {
  let s = emptyState();
  s = updateUnit(s, 'u', (u) => ({ ...u, reflection: 'hola' }));
  const back = parseImport(exportJSON(s));
  assert.equal(unitState(back, 'u').reflection, 'hola');
  assert.throws(() => parseImport('{"a":1}'), /no es una copia/);
  assert.throws(() => parseImport('no json'), /JSON/);
  assert.throws(() => parseImport(JSON.stringify({ app: 'campus-premaster', schemaVersion: 99 })), /más nueva/);
});

test('store: load/save con almacenamiento simulado y con datos corruptos', () => {
  const mem = new Map();
  const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  const s = updateUnit(emptyState(), 'u', (u) => ({ ...u, reflection: 'r' }));
  assert.ok(save(storage, s));
  assert.equal(unitState(load(storage), 'u').reflection, 'r');
  mem.set('campus-premaster:v1', '{roto');
  assert.deepEqual(load(storage).units, {});
});

const Q = [
  { id: 'q1', conceptId: 'c1', correct: 'a' },
  { id: 'q2', conceptId: 'c2', correct: 'b' },
];

test('test: 1 punto al primer intento, 0,5 al segundo, 0 si falla ambos', () => {
  assert.equal(gradeAnswer(Q[0], 'a').points, 1);
  assert.equal(gradeAnswer(Q[0], 'b', 'a').points, 0.5);
  assert.equal(gradeAnswer(Q[0], 'b', 'c').points, 0);
  const r = scoreAttempt(Q, { q1: { first: 'a' }, q2: { first: 'a', second: 'b' } });
  assert.equal(r.points, 1.5);
  assert.deepEqual(r.failedConcepts, ['c2']);
  assert.equal(r.passed, true);
  assert.equal(r.complete, true);
});

test('test: los fallos van al historial y obligan a repasar el concepto', () => {
  const { state } = applyQuizResult(emptyState(), 'u1', Q, { q1: { first: 'a' }, q2: { first: 'c', second: 'a' } }, T0);
  assert.equal(state.errors.length, 1);
  assert.equal(state.errors[0].conceptId, 'c2');
  assert.equal(dueCards(state.cards, T0).map((c) => c.id).join(), 'c2');
  assert.deepEqual(weakConcepts(state), [{ conceptId: 'c2', count: 1 }]);
  assert.equal(unitState(state, 'u1').quizAttempts.length, 1);
  const after = reviewConcept(state, 'c2', GRADES.HARD, T0);
  assert.equal(weakConcepts(after).length, 1, 'recordar con dificultad no cierra el error');
  const fixed = reviewConcept(state, 'c2', GRADES.GOOD, T0);
  assert.equal(weakConcepts(fixed).length, 0);
});

test('seedCards no pisa tarjetas existentes y vence al día siguiente', () => {
  const s0 = { ...emptyState(), cards: { a: { ...newCard('a', T0), reps: 3 } } };
  const s = seedCards(s0, ['a', 'b'], T0);
  assert.equal(s.cards.a.reps, 3);
  assert.equal(s.cards.b.due, T0 + DAY);
});

test('planner: semana empieza en lunes y suma minutos de la semana', () => {
  const wed = new Date('2026-11-04T12:00:00');
  assert.equal(localDay(weekStart(wed)), '2026-11-02');
  assert.equal(localDay(weekStart(new Date('2026-11-08T12:00:00'))), '2026-11-02');
  const sessions = [{ date: '2026-11-01', minutes: 50 }, { date: '2026-11-02', minutes: 30 }, { date: '2026-11-08', minutes: 40 }, { date: '2026-11-09', minutes: 99 }];
  assert.equal(minutesThisWeek(sessions, wed), 70);
  const grid = calendarGrid(sessions, wed, 2);
  assert.equal(grid.length, 2);
  assert.equal(grid[1][0].day, '2026-11-02');
  assert.equal(grid[1][0].minutes, 30);
  assert.equal(grid[1][2].today, true);
  assert.equal(grid[1][3].future, true);
});

test('planner: próximo día de estudio', () => {
  const wed = new Date('2026-11-04T12:00:00'); // miércoles
  assert.equal(nextStudyDay([3], wed).inDays, 0);
  assert.equal(nextStudyDay([6], wed).inDays, 3);
  assert.equal(nextStudyDay([], wed), null);
});

test('planner: recomienda en orden repaso → secciones → ejercicios → test', () => {
  let s = emptyState();
  assert.equal(recommend(s, UNIT, T0).kind, 'section');
  s = updateUnit(s, UNIT.id, (u) => ({ ...u, sections: Object.fromEntries(UNIT.sections.map((x) => [x.id, true])) }));
  assert.equal(recommend(s, UNIT, T0).kind, 'exercise');
  s = updateUnit(s, UNIT.id, (u) => ({ ...u, exercises: Object.fromEntries(UNIT.exercises.map((x) => [x.id, { done: true }])) }));
  assert.equal(recommend(s, UNIT, T0).kind, 'quiz');
  s = seedCards(s, [UNIT.concepts[0].id], T0, 0);
  assert.equal(recommend(s, UNIT, T0).kind, 'review');
});

test('contenido: la unidad es coherente', () => {
  const concepts = new Set(UNIT.concepts.map((c) => c.id));
  assert.equal(UNIT.quiz.length, 8, 'ocho preguntas de evaluación');
  for (const q of UNIT.quiz) {
    assert.ok(concepts.has(q.conceptId), `concepto de ${q.id}`);
    assert.ok(q.options.some((o) => o.id === q.correct), `respuesta de ${q.id}`);
    for (const o of q.options) assert.ok(o.feedback && o.feedback.length > 30, `corrección razonada en ${q.id}/${o.id}`);
  }
  for (const s of UNIT.sections) {
    assert.ok(s.recall?.prompt && s.recall?.model, `recuperación en ${s.id}`);
    for (const c of s.concepts) assert.ok(concepts.has(c), `concepto ${c} de ${s.id}`);
  }
  for (const c of UNIT.concepts) assert.ok(c.front && c.back, `tarjeta ${c.id}`);
  for (const e of UNIT.exercises) for (const c of e.concepts) assert.ok(concepts.has(c), `concepto ${c} de ${e.id}`);
  const p = unitProgress(UNIT, unitState(emptyState(), UNIT.id));
  assert.equal(p.pct, 0);
});

test('contenido: catálogo, unidades y referencias enlazan entre sí', async () => {
  const { SUBJECTS, UNITS, REFERENCES, CONCEPTS } = await import('../campus/js/content/index.js');
  const refIds = new Set(REFERENCES.map((r) => r.id));
  for (const s of SUBJECTS) for (const id of s.units) assert.ok(UNITS[id], `unidad ${id} registrada`);
  for (const u of Object.values(UNITS)) {
    for (const r of u.references) assert.ok(refIds.has(r), `referencia ${r}`);
    for (const c of u.concepts) assert.ok(CONCEPTS[c.id].sectionId, `el concepto ${c.id} se estudia en alguna sección`);
  }
});
