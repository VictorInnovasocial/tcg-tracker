// Unidad: índice, secciones con recuperación de memoria, ejercicios, test, reflexión y actividad aplicada.
import { esc, bar, aiBadge, fmtDate, shuffle } from './dom.js';
import { UNITS, CONCEPTS, REFERENCES, subjectOf } from '../content/index.js';
import { unitState, updateUnit, touch } from '../core/store.js';
import { unitProgress, logError, seedCards, applyQuizResult, gradeAnswer, PASS_MARK, bestQuiz } from '../core/learning.js';

const RECALL_MIN = 80;

export function upsertPortfolio(state, item, now = new Date()) {
  const existing = state.portfolio.find((p) => p.id === item.id);
  const iso = now.toISOString();
  const next = existing ? { ...existing, ...item, updatedAt: iso } : { createdAt: iso, updatedAt: iso, ...item };
  return touch({ ...state, portfolio: existing ? state.portfolio.map((p) => (p.id === item.id ? next : p)) : [...state.portfolio, next] });
}

const term = (id) => CONCEPTS[id]?.term ?? id;

function steps(unit) {
  return [
    ...unit.sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })),
    { id: 'ejercicios', label: 'Ejercicios' },
    { id: 'test', label: 'Test de evaluación' },
    { id: 'reflexion', label: 'Reflexión' },
    { id: 'actividad', label: 'Actividad aplicada' },
  ];
}

function stepDone(unit, u, state, id) {
  if (u.sections[id]) return true;
  if (id === 'ejercicios') return unit.exercises.every((e) => u.exercises[e.id]?.done);
  if (id === 'test') return bestQuiz(u) >= PASS_MARK;
  if (id === 'reflexion') return u.reflection.trim().length >= unit.reflection.minChars;
  if (id === 'actividad') return state.portfolio.some((p) => p.id === `${unit.id}-${unit.activity.id}` && Object.values(p.rubric ?? {}).filter(Boolean).length === unit.activity.rubric.length);
  return false;
}

function stepNav(unit, current) {
  const all = steps(unit);
  const i = all.findIndex((s) => s.id === current);
  const prev = all[i - 1];
  const next = all[i + 1];
  return `<nav class="step-nav" aria-label="Navegación de la unidad">
    ${prev ? `<a href="#${unit.id}-${prev.id}">← ${esc(prev.label)}</a>` : `<a href="#${unit.id}">← Índice de la unidad</a>`}
    ${next ? `<a href="#${unit.id}-${next.id}">${esc(next.label)} →</a>` : `<a href="#${unit.id}">Índice de la unidad →</a>`}
  </nav>`;
}

function crumbs(unit, label) {
  return `<p class="crumbs"><a href="#asignaturas">${esc(subjectOf(unit).name)}</a> › <a href="#${unit.id}">Unidad ${unit.number}</a>${label ? ` › ${esc(label)}` : ''}</p>`;
}

// ───────────────────────── Índice ─────────────────────────
function renderOverview(ctx, unit) {
  const u = unitState(ctx.state, unit.id);
  const p = unitProgress(unit, u);
  return `
${crumbs(unit)}
<header class="page-head">
  <p class="eyebrow">Unidad ${unit.number} · unas ${unit.estimatedHours} horas ${aiBadge()}</p>
  <h1>${esc(unit.title)}</h1>
  <p class="lead">${esc(unit.summary)}</p>
</header>
<div class="note">Este material lo ha redactado una IA a partir de manuales de metodología (ver <a href="#biblioteca">Biblioteca</a>). Sirve para preparar la asignatura, pero <strong>no es su programa oficial</strong>: contrástalo con la guía docente y con las fuentes.</div>
<section class="card">
  <div class="row-between"><h2>Tu progreso</h2><strong>${p.pct} %</strong></div>
  ${bar(p.pct, 'Progreso de la unidad')}
  <ol class="steps">
    ${steps(unit).map((s) => `<li class="${stepDone(unit, u, ctx.state, s.id) ? 'done' : ''}"><a href="#${unit.id}-${s.id}">${esc(s.label)}</a></li>`).join('')}
  </ol>
  <p class="muted small">Una sección cuenta como estudiada cuando haces su recuperación de memoria. El test se supera con un ${Math.round(PASS_MARK * 100)} %. La reflexión necesita al menos ${unit.reflection.minChars} caracteres.</p>
</section>
<section class="card">
  <h2>Resultados de aprendizaje</h2>
  <ul>${unit.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
</section>`;
}

// ───────────────────────── Sección ─────────────────────────
function renderSection(ctx, unit, sec) {
  const u = unitState(ctx.state, unit.id);
  const r = (ctx.ui.recall ??= {})[sec.id] ?? { phase: u.sections[sec.id] ? 'done' : 'idle', checks: {} };
  ctx.ui.recall[sec.id] = r;
  const text = u.recall[sec.id] ?? '';
  const hidden = r.phase === 'writing';
  const idx = unit.sections.indexOf(sec) + 1;
  return `
${crumbs(unit, `Sección ${idx}`)}
<header class="page-head">
  <p class="eyebrow">Sección ${idx} de ${unit.sections.length} · ${sec.minutes} min ${aiBadge()}</p>
  <h1>${esc(sec.title)}</h1>
</header>
<article class="card prose ${hidden ? 'is-hidden' : ''}" ${hidden ? 'aria-hidden="true"' : ''}>
  ${hidden ? '<p class="muted">El texto está oculto mientras recuperas de memoria.</p>' : sec.body}
</article>
${hidden ? '' : sec.examples.map((ex) => `<details class="card example"><summary>${esc(ex.title)}</summary><div class="prose">${ex.body}</div></details>`).join('')}

<section class="card recall" id="recall">
  <p class="eyebrow">Recuperación de memoria</p>
  <h2>Antes de seguir: escríbelo sin mirar</h2>
  <p>${esc(sec.recall.prompt)}</p>
  ${r.phase === 'idle' ? `<p class="muted small">Al empezar se ocultará el texto de la sección. Recordar con esfuerzo fija mucho más que releer.</p><button class="btn btn-primary" data-action="recall-start">Empezar recuperación</button>` : ''}
  ${r.phase === 'writing' ? `
    <textarea data-recall rows="8" placeholder="Escribe con tus palabras…" aria-label="Tu respuesta de memoria">${esc(text)}</textarea>
    <p class="muted small"><span data-count>${text.trim().length}</span>/${RECALL_MIN} caracteres mínimos</p>
    <button class="btn btn-primary" data-action="recall-compare" ${text.trim().length < RECALL_MIN ? 'disabled' : ''}>Comparar con la respuesta modelo</button>` : ''}
  ${r.phase === 'compare' ? `
    <div class="compare">
      <div><h3>Tu respuesta</h3><p class="answer">${esc(text)}</p></div>
      <div><h3>Respuesta modelo</h3><p>${esc(sec.recall.model)}</p></div>
    </div>
    <fieldset><legend>Marca solo lo que <strong>sí</strong> habías recordado</legend>
      ${sec.recall.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-check="${i}" ${r.checks[i] ? 'checked' : ''}> ${esc(c.text)}</label>`).join('')}
    </fieldset>
    <p class="muted small">Lo que no marques se anotará en tu historial de errores y su tarjeta aparecerá en el repaso de hoy.</p>
    <button class="btn btn-primary" data-action="recall-save">Guardar y marcar la sección como estudiada</button>` : ''}
  ${r.phase === 'done' ? `
    <p class="ok">Sección estudiada el ${fmtDate(u.sections[sec.id])}.</p>
    ${text ? `<details><summary>Ver lo que escribiste</summary><p class="answer">${esc(text)}</p></details>` : ''}
    <button class="btn" data-action="recall-again">Repetir la recuperación</button>` : ''}
</section>
${stepNav(unit, sec.id)}`;
}

function bindSection(root, ctx, unit, sec) {
  const r = ctx.ui.recall[sec.id];
  let t;
  root.querySelector('[data-recall]')?.addEventListener('input', (e) => {
    const v = e.target.value;
    root.querySelector('[data-count]').textContent = v.trim().length;
    root.querySelector('[data-action="recall-compare"]').disabled = v.trim().length < RECALL_MIN;
    clearTimeout(t);
    t = setTimeout(() => ctx.commit(updateUnit(ctx.state, unit.id, (u) => ({ ...u, recall: { ...u.recall, [sec.id]: v } })), { render: false }), 400);
  });
  root.addEventListener('change', (e) => {
    if (e.target.dataset.check != null) r.checks[e.target.dataset.check] = e.target.checked;
  });
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]')?.dataset.action;
    if (!a) return;
    if (a === 'recall-start' || a === 'recall-again') {
      r.phase = 'writing';
      r.checks = {};
      ctx.commit(updateUnit(ctx.state, unit.id, (u) => ({ ...u, recall: { ...u.recall, [sec.id]: '' } })), { render: false });
      ctx.rerender();
      document.querySelector('[data-recall]')?.focus();
      document.getElementById('recall')?.scrollIntoView({ block: 'start' });
    }
    if (a === 'recall-compare') {
      const v = root.querySelector('[data-recall]').value;
      clearTimeout(t);
      r.phase = 'compare';
      ctx.commit(updateUnit(ctx.state, unit.id, (u) => ({ ...u, recall: { ...u.recall, [sec.id]: v } })));
    }
    if (a === 'recall-save') {
      let s = updateUnit(ctx.state, unit.id, (u) => ({ ...u, sections: { ...u.sections, [sec.id]: new Date().toISOString() } }));
      s = seedCards(s, sec.concepts);
      const missed = new Set(sec.recall.checklist.filter((_, i) => !r.checks[i]).map((c) => c.concept));
      for (const concept of missed) s = logError(s, { unitId: unit.id, conceptId: concept, source: `recuperación:${sec.id}`, detail: `No recordado en «${sec.title}»` });
      r.phase = 'done';
      ctx.commit(s);
    }
  });
}

// ───────────────────────── Ejercicios ─────────────────────────
function renderClassify(ctx, unit, ex) {
  const saved = unitState(ctx.state, unit.id).exercises[ex.id];
  const st = ((ctx.ui.ex ??= {})[ex.id] ??= { items: {} });
  const answered = ex.items.filter((it) => st.items[it.id]?.final).length;
  const optLabel = (id) => ex.options.find((o) => o.id === id)?.label;
  return `
<section class="card exercise" id="${ex.id}">
  <div class="row-between"><h2>${esc(ex.title)}</h2>${saved?.done ? `<span class="badge badge-ok">Hecho · ${Math.round(saved.score * 100)} % al primer intento</span>` : ''}</div>
  <p>${esc(ex.instructions)}</p>
  <ol class="items">
  ${ex.items.map((it) => {
    const a = st.items[it.id] ?? {};
    const tried = [a.first, a.second].filter(Boolean);
    return `<li class="item">
      <p class="item-text">${esc(it.text)}</p>
      <div class="opts" role="group" aria-label="Opciones">
        ${ex.options.map((o) => {
          const cls = a.final ? (o.id === it.answer ? 'right' : tried.includes(o.id) ? 'wrong' : '') : tried.includes(o.id) ? 'wrong' : '';
          return `<button class="opt ${cls}" data-ex="${ex.id}" data-item="${it.id}" data-opt="${o.id}" ${a.final || tried.includes(o.id) ? 'disabled' : ''}>${esc(o.label)}</button>`;
        }).join('')}
      </div>
      ${a.first && !a.final ? `<p class="hint">No es correcto. Piensa en: <strong>${esc(term(it.concept))}</strong>. Elige otra opción.</p>` : ''}
      ${a.final ? `<p class="feedback ${a.first === it.answer ? 'ok' : 'ko'}"><strong>${a.first === it.answer ? 'Correcto' : `Respuesta: ${esc(optLabel(it.answer))}`}.</strong> ${esc(it.why)}</p>` : ''}
    </li>`;
  }).join('')}
  </ol>
  <p class="muted small">${answered}/${ex.items.length} resueltas.</p>
  ${answered === ex.items.length ? `<button class="btn" data-reset="${ex.id}">Repetir el ejercicio</button>` : ''}
</section>`;
}

function renderRewrite(ctx, unit, ex) {
  const saved = unitState(ctx.state, unit.id).exercises[ex.id];
  const st = ((ctx.ui.ex ??= {})[ex.id] ??= { text: saved?.text ?? '', checks: saved?.checks ?? {}, phase: saved?.done ? 'done' : 'writing' });
  const len = st.text.trim().length;
  return `
<section class="card exercise" id="${ex.id}">
  <div class="row-between"><h2>${esc(ex.title)}</h2>${saved?.done ? '<span class="badge badge-ok">Guardado en el portafolio</span>' : ''}</div>
  <p>${esc(ex.instructions)}</p>
  <blockquote>${esc(ex.start)}</blockquote>
  ${st.phase === 'writing' ? `
    <textarea data-rewrite="${ex.id}" rows="5" aria-label="Tu pregunta reformulada" placeholder="Tu versión de la pregunta…">${esc(st.text)}</textarea>
    <p class="muted small"><span data-count>${len}</span>/${ex.minChars} caracteres mínimos</p>
    <fieldset data-checks ${len < ex.minChars ? 'hidden' : ''}><legend>Autoevaluación: ¿tu pregunta cumple…?</legend>
      ${ex.checklist.map((c, i) => `<label class="check"><input type="checkbox" data-rcheck="${i}" ${st.checks[i] ? 'checked' : ''}> ${esc(c.text)}</label>`).join('')}
    </fieldset>
    <button class="btn btn-primary" data-rewrite-save="${ex.id}" ${len < ex.minChars ? 'disabled' : ''}>Guardar y ver la propuesta de referencia</button>` : `
    <div class="compare">
      <div><h3>Tu versión</h3><p class="answer">${esc(st.text)}</p></div>
      <div><h3>Propuesta de referencia</h3><p>${esc(ex.model)}</p></div>
    </div>
    <p class="muted small">Los criterios que no marcaste se han anotado en tu historial de errores.</p>
    <button class="btn" data-rewrite-again="${ex.id}">Escribir otra versión</button>`}
</section>`;
}

function renderExercises(ctx, unit) {
  return `
${crumbs(unit, 'Ejercicios')}
<header class="page-head">
  <p class="eyebrow">Práctica aplicada ${aiBadge()}</p>
  <h1>Ejercicios</h1>
  <p class="lead">Si fallas, primero se te da una pista y tienes un segundo intento. La explicación llega después. Los fallos al primer intento se anotan para repasar.</p>
</header>
${unit.exercises.map((ex) => (ex.type === 'classify' ? renderClassify(ctx, unit, ex) : renderRewrite(ctx, unit, ex))).join('')}
${stepNav(unit, 'ejercicios')}`;
}

function bindExercises(root, ctx, unit) {
  root.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-opt]');
    if (opt) {
      const ex = unit.exercises.find((x) => x.id === opt.dataset.ex);
      const it = ex.items.find((x) => x.id === opt.dataset.item);
      const st = ctx.ui.ex[ex.id];
      const a = (st.items[it.id] ??= {});
      if (!a.first) a.first = opt.dataset.opt;
      else a.second = opt.dataset.opt;
      a.final = a.first === it.answer || Boolean(a.second);
      const allDone = ex.items.every((x) => st.items[x.id]?.final);
      if (allDone && !st.saved) {
        st.saved = true;
        const wrong = ex.items.filter((x) => st.items[x.id].first !== x.answer);
        let s = updateUnit(ctx.state, unit.id, (u) => ({ ...u, exercises: { ...u.exercises, [ex.id]: { done: true, at: new Date().toISOString(), score: (ex.items.length - wrong.length) / ex.items.length, wrong: wrong.map((x) => x.id) } } }));
        for (const x of wrong) s = logError(s, { unitId: unit.id, conceptId: x.concept, source: `ejercicio:${ex.id}`, detail: x.text });
        ctx.commit(s);
      } else ctx.rerender();
      return;
    }
    const reset = e.target.closest('[data-reset]');
    if (reset) {
      ctx.ui.ex[reset.dataset.reset] = { items: {} };
      ctx.rerender();
      return;
    }
    const save = e.target.closest('[data-rewrite-save]');
    if (save) {
      const ex = unit.exercises.find((x) => x.id === save.dataset.rewriteSave);
      const st = ctx.ui.ex[ex.id];
      let s = updateUnit(ctx.state, unit.id, (u) => ({ ...u, exercises: { ...u.exercises, [ex.id]: { done: true, at: new Date().toISOString(), text: st.text, checks: st.checks } } }));
      const missed = new Set(ex.checklist.filter((_, i) => !st.checks[i]).map((c) => c.concept));
      for (const c of missed) s = logError(s, { unitId: unit.id, conceptId: c, source: `ejercicio:${ex.id}`, detail: 'Criterio no cumplido al reformular la pregunta' });
      s = upsertPortfolio(s, { id: `${unit.id}-${ex.id}`, unitId: unit.id, kind: 'ejercicio', title: ex.title, fields: { 'Pregunta de partida': ex.start, 'Mi versión': st.text } });
      st.phase = 'done';
      ctx.commit(s);
      return;
    }
    const again = e.target.closest('[data-rewrite-again]');
    if (again) {
      const st = ctx.ui.ex[again.dataset.rewriteAgain];
      st.phase = 'writing';
      st.checks = {};
      ctx.rerender();
    }
  });
  root.addEventListener('input', (e) => {
    const id = e.target.dataset.rewrite;
    if (!id) return;
    const ex = unit.exercises.find((x) => x.id === id);
    const st = ctx.ui.ex[id];
    st.text = e.target.value;
    const len = st.text.trim().length;
    const card = e.target.closest('.exercise');
    card.querySelector('[data-count]').textContent = len;
    card.querySelector('[data-checks]').hidden = len < ex.minChars;
    card.querySelector('[data-rewrite-save]').disabled = len < ex.minChars;
  });
  root.addEventListener('change', (e) => {
    if (e.target.dataset.rcheck == null) return;
    const id = e.target.closest('.exercise').id;
    ctx.ui.ex[id].checks[e.target.dataset.rcheck] = e.target.checked;
  });
}

// ───────────────────────── Test ─────────────────────────
function newQuiz(unit) {
  const order = shuffle(unit.quiz.map((q) => q.id));
  return { order, optOrder: Object.fromEntries(unit.quiz.map((q) => [q.id, shuffle(q.options.map((o) => o.id))])), idx: 0, answers: {}, result: null };
}

function renderQuiz(ctx, unit) {
  const u = unitState(ctx.state, unit.id);
  const qz = ctx.ui.quiz?.unitId === unit.id ? ctx.ui.quiz : null;
  const head = `${crumbs(unit, 'Test')}
<header class="page-head"><p class="eyebrow">Autoevaluación · ${unit.quiz.length} preguntas ${aiBadge()}</p><h1>Test de evaluación</h1></header>`;

  if (!qz) {
    return `${head}
<section class="card">
  <h2>Cómo funciona</h2>
  <ul>
    <li>Cada pregunta tiene dos intentos. Si fallas, verás por qué tu opción no es correcta y podrás volver a pensar antes de ver la solución.</li>
    <li>Puntuación: 1 punto al primer intento, 0,5 al segundo. Se supera con un ${Math.round(PASS_MARK * 100)} %.</li>
    <li>Cada fallo al primer intento se anota en tu historial y su concepto pasa al repaso de hoy.</li>
  </ul>
  <button class="btn btn-primary" data-action="quiz-start">${u.quizAttempts.length ? 'Hacer el test otra vez' : 'Empezar el test'}</button>
</section>
${u.quizAttempts.length ? `<section class="card"><h2>Intentos anteriores</h2><ul class="attempts">${[...u.quizAttempts].reverse().map((a) => `<li>${fmtDate(a.at)} · <strong>${a.points.toLocaleString('es-ES')} / ${a.max}</strong> (${Math.round((a.points / a.max) * 100)} %)</li>`).join('')}</ul></section>` : ''}
${stepNav(unit, 'test')}`;
  }

  if (qz.result) {
    const r = qz.result;
    return `${head}
<section class="card">
  <h2>${r.passed ? 'Test superado' : 'Todavía no superado'}: ${r.points.toLocaleString('es-ES')} / ${r.max}</h2>
  ${bar(r.pct * 100, 'Resultado')}
  ${r.failedConcepts.length ? `<p>Conceptos que fallaste al primer intento (ya están en tu repaso de hoy):</p><ul>${r.failedConcepts.map((c) => `<li>${esc(term(c))}</li>`).join('')}</ul><p><a class="btn btn-primary" href="#repaso">Recuperarlos ahora</a></p>` : '<p>Sin fallos al primer intento.</p>'}
  <button class="btn" data-action="quiz-reset">Volver</button>
</section>
<section class="card"><h2>Revisión razonada</h2>
${qz.order.map((qid, i) => {
  const q = unit.quiz.find((x) => x.id === qid);
  const a = qz.answers[qid];
  const g = gradeAnswer(q, a.first, a.second);
  const right = q.options.find((o) => o.id === q.correct);
  return `<div class="review-q"><p><strong>${i + 1}. ${esc(q.stem)}</strong> <span class="badge ${g.firstCorrect ? 'badge-ok' : g.finalCorrect ? 'badge-warn' : 'badge-ko'}">${g.points.toLocaleString('es-ES')} pt</span></p>
  <p class="feedback ok"><strong>${esc(right.text)}</strong> ${esc(right.feedback)}</p></div>`;
}).join('')}
</section>`;
  }

  const qid = qz.order[qz.idx];
  const q = unit.quiz.find((x) => x.id === qid);
  const a = qz.answers[qid] ?? {};
  const tried = [a.first, a.second].filter(Boolean);
  const final = a.first === q.correct || Boolean(a.second);
  const fb = (id) => q.options.find((o) => o.id === id);
  return `${head}
<section class="card quiz">
  <p class="eyebrow">Pregunta ${qz.idx + 1} de ${qz.order.length} · ${esc(term(q.conceptId))}</p>
  ${bar((qz.idx / qz.order.length) * 100, 'Avance del test')}
  <h2 class="q-stem">${esc(q.stem)}</h2>
  <div class="q-opts">
    ${qz.optOrder[qid].map((oid, i) => {
      const o = fb(oid);
      const cls = final ? (oid === q.correct ? 'right' : tried.includes(oid) ? 'wrong' : '') : tried.includes(oid) ? 'wrong' : '';
      return `<button class="opt opt-block ${cls}" data-qopt="${oid}" ${final || tried.includes(oid) ? 'disabled' : ''}><span class="opt-letter">${'ABCD'[i]}</span> ${esc(o.text)}</button>`;
    }).join('')}
  </div>
  ${a.first && a.first !== q.correct ? `<p class="feedback ko"><strong>Tu primera opción:</strong> ${esc(fb(a.first).feedback)}</p>` : ''}
  ${a.first && !final ? '<p class="hint">Vuelve a pensarlo y elige otra opción.</p>' : ''}
  ${a.second && a.second !== q.correct ? `<p class="feedback ko"><strong>Tu segunda opción:</strong> ${esc(fb(a.second).feedback)}</p>` : ''}
  ${final ? `<p class="feedback ok"><strong>${a.first === q.correct || a.second === q.correct ? 'Correcto.' : 'Respuesta correcta:'}</strong> ${esc(fb(q.correct).feedback)}</p>
  <button class="btn btn-primary" data-action="quiz-next">${qz.idx + 1 < qz.order.length ? 'Siguiente pregunta' : 'Ver resultado'}</button>` : ''}
</section>`;
}

function bindQuiz(root, ctx, unit) {
  root.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-qopt]');
    const qz = ctx.ui.quiz;
    if (opt && qz) {
      const qid = qz.order[qz.idx];
      const a = (qz.answers[qid] ??= {});
      if (!a.first) a.first = opt.dataset.qopt;
      else if (!a.second) a.second = opt.dataset.qopt;
      ctx.rerender();
      return;
    }
    const act = e.target.closest('[data-action]')?.dataset.action;
    if (act === 'quiz-start') {
      ctx.ui.quiz = { ...newQuiz(unit), unitId: unit.id };
      ctx.rerender();
    }
    if (act === 'quiz-next') {
      if (qz.idx + 1 < qz.order.length) {
        qz.idx += 1;
        ctx.rerender();
        root.ownerDocument.querySelector('.quiz')?.scrollIntoView({ block: 'start' });
      } else {
        const { state, result } = applyQuizResult(ctx.state, unit.id, unit.quiz, qz.answers);
        qz.result = result;
        ctx.commit(state);
      }
    }
    if (act === 'quiz-reset') {
      ctx.ui.quiz = null;
      ctx.rerender();
    }
  });
}

// ───────────────────────── Reflexión ─────────────────────────
function renderReflection(ctx, unit) {
  const u = unitState(ctx.state, unit.id);
  const len = u.reflection.trim().length;
  const inPortfolio = ctx.state.portfolio.find((p) => p.id === `${unit.id}-reflexion`);
  return `
${crumbs(unit, 'Reflexión')}
<header class="page-head"><p class="eyebrow">Actividad de reflexión</p><h1>Reflexión de la unidad</h1></header>
<section class="card">
  <p><strong>${esc(unit.reflection.prompt)}</strong> Responde, con tus palabras, a estas preguntas:</p>
  <ol>${unit.reflection.guide.map((g) => `<li>${esc(g)}</li>`).join('')}</ol>
  <textarea data-reflection rows="14" aria-label="Tu reflexión">${esc(u.reflection)}</textarea>
  <p class="muted small"><span data-count>${len}</span> caracteres (mínimo ${unit.reflection.minChars}). Se guarda automáticamente mientras escribes.</p>
  <button class="btn btn-primary" data-action="reflection-portfolio" ${len < unit.reflection.minChars ? 'disabled' : ''}>${inPortfolio ? 'Actualizar en el portafolio' : 'Añadir al portafolio'}</button>
  ${inPortfolio ? `<span class="muted small">Última versión en el portafolio: ${fmtDate(inPortfolio.updatedAt)}</span>` : ''}
</section>
${stepNav(unit, 'reflexion')}`;
}

function bindReflection(root, ctx, unit) {
  let t;
  root.querySelector('[data-reflection]').addEventListener('input', (e) => {
    const v = e.target.value;
    root.querySelector('[data-count]').textContent = v.trim().length;
    root.querySelector('[data-action="reflection-portfolio"]').disabled = v.trim().length < unit.reflection.minChars;
    clearTimeout(t);
    t = setTimeout(() => ctx.commit(updateUnit(ctx.state, unit.id, (u) => ({ ...u, reflection: v })), { render: false }), 400);
  });
  root.querySelector('[data-action="reflection-portfolio"]').addEventListener('click', () => {
    clearTimeout(t);
    const v = root.querySelector('[data-reflection]').value;
    let s = updateUnit(ctx.state, unit.id, (u) => ({ ...u, reflection: v }));
    s = upsertPortfolio(s, { id: `${unit.id}-reflexion`, unitId: unit.id, kind: 'reflexion', title: `Reflexión · ${unit.title}`, fields: { Reflexión: v } });
    ctx.commit(s);
  });
}

// ───────────────────────── Actividad aplicada ─────────────────────────
function renderActivity(ctx, unit) {
  const act = unit.activity;
  const pid = `${unit.id}-${act.id}`;
  const item = ctx.state.portfolio.find((p) => p.id === pid);
  const fields = item?.fields ?? {};
  const rubric = item?.rubric ?? {};
  const unitRefs = REFERENCES.filter((r) => unit.references.includes(r.id));
  return `
${crumbs(unit, 'Actividad aplicada')}
<header class="page-head"><p class="eyebrow">Actividad aplicada · unos ${act.minutes} min · entregable de portafolio</p><h1>${esc(act.title)}</h1><p class="lead">${esc(act.description)}</p></header>
<form class="card activity" data-form="activity">
  ${act.fields.map((f) => `<label>${esc(f.label)}${f.rows > 1 ? `<textarea name="${f.id}" rows="${f.rows}">${esc(fields[f.label] ?? '')}</textarea>` : `<input name="${f.id}" value="${esc(fields[f.label] ?? '')}">`}</label>`).join('')}
  <details><summary>Fuentes de la biblioteca de esta unidad</summary><ul class="refs-mini">${unitRefs.map((r) => `<li>${r.apa}</li>`).join('')}</ul></details>
  <fieldset><legend>Rúbrica de autoevaluación (marca lo que cumple tu borrador)</legend>
    ${act.rubric.map((r) => `<label class="check"><input type="checkbox" name="rubric-${r.id}" ${rubric[r.id] ? 'checked' : ''}> ${esc(r.text)}</label>`).join('')}
  </fieldset>
  <div class="row"><button class="btn btn-primary" type="submit">Guardar en el portafolio</button><span class="ko small" data-msg role="status"></span>${item ? `<span class="muted small">Guardado el ${fmtDate(item.updatedAt)}</span>` : ''}</div>
</form>
${stepNav(unit, 'actividad')}`;
}

function bindActivity(root, ctx, unit) {
  const act = unit.activity;
  root.querySelector('[data-form="activity"]').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const fields = Object.fromEntries(act.fields.map((x) => [x.label, String(f.get(x.id) ?? '').trim()]));
    if (!Object.values(fields).some(Boolean)) {
      e.currentTarget.querySelector('[data-msg]').textContent = 'El borrador está vacío: rellena al menos un campo.';
      return;
    }
    const rubric = Object.fromEntries(act.rubric.map((r) => [r.id, f.get(`rubric-${r.id}`) === 'on']));
    ctx.commit(upsertPortfolio(ctx.state, { id: `${unit.id}-${act.id}`, unitId: unit.id, kind: 'actividad', title: act.title, fields, rubric, rubricLabels: Object.fromEntries(act.rubric.map((r) => [r.id, r.text])) }));
  });
}

// ───────────────────────── Router de la unidad ─────────────────────────
function resolve(ctx) {
  const unit = UNITS[ctx.params[0]] ?? Object.values(UNITS)[0];
  const part = ctx.params[1] ?? '';
  return { unit, part, sec: unit.sections.find((s) => s.id === part) };
}

export function render(ctx) {
  const { unit, part, sec } = resolve(ctx);
  if (sec) return renderSection(ctx, unit, sec);
  if (part === 'ejercicios') return renderExercises(ctx, unit);
  if (part === 'test') return renderQuiz(ctx, unit);
  if (part === 'reflexion') return renderReflection(ctx, unit);
  if (part === 'actividad') return renderActivity(ctx, unit);
  return renderOverview(ctx, unit);
}

export function bind(root, ctx) {
  const { unit, part, sec } = resolve(ctx);
  if (sec) bindSection(root, ctx, unit, sec);
  else if (part === 'ejercicios') bindExercises(root, ctx, unit);
  else if (part === 'test') bindQuiz(root, ctx, unit);
  else if (part === 'reflexion') bindReflection(root, ctx, unit);
  else if (part === 'actividad') bindActivity(root, ctx, unit);
}
