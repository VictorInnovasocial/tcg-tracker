// Repaso espaciado: variante simplificada de SM-2 (Wozniak, 1990).
// Funciones puras: reciben el estado de una tarjeta y devuelven el siguiente.

export const GRADES = Object.freeze({ AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 });

const DAY = 24 * 60 * 60 * 1000;
const MIN_EASE = 1.3;

export function newCard(id, now = Date.now()) {
  return { id, ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now, last: null };
}

/** Programa la siguiente revisión según la autoevaluación del recuerdo. */
export function review(card, grade, now = Date.now()) {
  if (!Object.values(GRADES).includes(grade)) throw new Error(`Nota no válida: ${grade}`);
  const c = { ...card, last: now };
  if (grade === GRADES.AGAIN) {
    c.reps = 0;
    c.lapses += 1;
    c.interval = 0;
    c.ease = Math.max(MIN_EASE, c.ease - 0.2);
    c.due = now + 10 * 60 * 1000; // vuelve en la misma sesión (10 min)
    return c;
  }
  c.reps += 1;
  if (grade === GRADES.HARD) c.ease = Math.max(MIN_EASE, c.ease - 0.15);
  if (grade === GRADES.EASY) c.ease += 0.15;
  if (c.reps === 1) c.interval = grade === GRADES.EASY ? 3 : 1;
  else if (c.reps === 2) c.interval = grade === GRADES.HARD ? 3 : 6;
  else c.interval = Math.round(c.interval * (grade === GRADES.HARD ? 1.2 : c.ease) * (grade === GRADES.EASY ? 1.3 : 1));
  c.due = now + c.interval * DAY;
  return c;
}

/** Marca una tarjeta para revisar ya (p. ej., tras fallar una pregunta del concepto). */
export function forceDue(card, now = Date.now()) {
  return { ...card, due: Math.min(card.due, now), reps: 0, interval: 0 };
}

export function dueCards(cards, now = Date.now()) {
  return Object.values(cards).filter((c) => c.due <= now).sort((a, b) => a.due - b.due);
}

/** Dominio aproximado 0..1 de una tarjeta, para paneles. */
export function mastery(card) {
  if (!card || card.reps === 0) return 0;
  return Math.min(1, card.interval / 21);
}
