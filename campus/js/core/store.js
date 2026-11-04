// Estado de la plataforma: forma, valores por defecto, validación e import/export.
// Todo puro salvo load/save, que reciben el almacenamiento como parámetro.

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'campus-premaster:v1';

export function emptyState(now = new Date()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    settings: { weeklyGoalMinutes: 210, studyDays: [1, 3, 6] }, // 0 = domingo
    sessions: [], // { date: 'YYYY-MM-DD', minutes, note }
    units: {}, // unitId -> { sections: {secId: true}, exercises: {exId: {...}}, quizAttempts: [...], reflection, recall: {secId: text} }
    cards: {}, // conceptId -> estado SRS
    errors: [], // { at, unitId, conceptId, source, detail, resolved }
    library: {}, // refId -> { status, notes, updatedAt }
    customRefs: [], // referencias añadidas por el estudiante
    portfolio: [], // { id, unitId, title, kind, content, rubric, createdAt, updatedAt }
    guides: {}, // subjectId -> { url, checkedAt, notes }
  };
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isDay = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** Normaliza cualquier objeto (de localStorage o de un JSON importado) a un estado válido. */
export function normalize(raw) {
  const base = emptyState();
  if (!isObj(raw)) return base;
  const s = { ...base };
  if (typeof raw.createdAt === 'string') s.createdAt = raw.createdAt;
  if (typeof raw.updatedAt === 'string') s.updatedAt = raw.updatedAt;
  if (isObj(raw.settings)) {
    const g = Number(raw.settings.weeklyGoalMinutes);
    if (Number.isFinite(g) && g > 0 && g <= 3000) s.settings.weeklyGoalMinutes = Math.round(g);
    if (Array.isArray(raw.settings.studyDays)) {
      s.settings.studyDays = [...new Set(raw.settings.studyDays.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort();
    }
  }
  if (Array.isArray(raw.sessions)) {
    s.sessions = raw.sessions
      .filter((x) => isObj(x) && isDay(x.date) && Number(x.minutes) > 0)
      .map((x) => ({ date: x.date, minutes: Math.round(Number(x.minutes)), note: String(x.note ?? '').slice(0, 500) }));
  }
  if (isObj(raw.units)) s.units = raw.units;
  if (isObj(raw.cards)) {
    for (const [id, c] of Object.entries(raw.cards)) {
      if (isObj(c) && Number.isFinite(c.due) && Number.isFinite(c.ease)) s.cards[id] = { ...c, id };
    }
  }
  if (Array.isArray(raw.errors)) s.errors = raw.errors.filter((e) => isObj(e) && typeof e.conceptId === 'string');
  if (isObj(raw.library)) s.library = raw.library;
  if (Array.isArray(raw.customRefs)) s.customRefs = raw.customRefs.filter((r) => isObj(r) && typeof r.title === 'string' && r.title.trim());
  if (Array.isArray(raw.portfolio)) s.portfolio = raw.portfolio.filter((p) => isObj(p) && typeof p.id === 'string');
  if (isObj(raw.guides)) s.guides = raw.guides;
  return s;
}

export function unitState(state, unitId) {
  const u = state.units[unitId] ?? {};
  return {
    sections: u.sections ?? {},
    recall: u.recall ?? {},
    exercises: u.exercises ?? {},
    quizAttempts: u.quizAttempts ?? [],
    reflection: u.reflection ?? '',
  };
}

/** Devuelve un estado nuevo con la unidad modificada por `fn`. */
export function updateUnit(state, unitId, fn) {
  const next = fn(unitState(state, unitId));
  return touch({ ...state, units: { ...state.units, [unitId]: next } });
}

export function touch(state, now = new Date()) {
  return { ...state, updatedAt: now.toISOString() };
}

export function exportJSON(state, now = new Date()) {
  return JSON.stringify({ app: 'campus-premaster', exportedAt: now.toISOString(), ...state }, null, 2);
}

/** Lanza un error legible si el texto no es una copia de esta aplicación. */
export function parseImport(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  if (!isObj(raw) || raw.app !== 'campus-premaster') throw new Error('El archivo no es una copia de Campus PREMÁSTER.');
  if (Number(raw.schemaVersion) > SCHEMA_VERSION) throw new Error('La copia es de una versión más nueva de la aplicación.');
  return normalize(raw);
}

export function load(storage) {
  try {
    const text = storage.getItem(STORAGE_KEY);
    return text ? normalize(JSON.parse(text)) : emptyState();
  } catch {
    return emptyState();
  }
}

export function save(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
