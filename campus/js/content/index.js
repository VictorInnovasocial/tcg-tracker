// Registro de contenidos. Para añadir una unidad: crea su archivo, impórtalo aquí
// y añade su id a `units` de la asignatura en catalog.js.
import { UNIT as IICS_U1 } from './iics-u1.js';
import { SUBJECTS, PROGRAM } from './catalog.js';
import { REFERENCES, READING_STATUS } from './references.js';

export { SUBJECTS, PROGRAM, REFERENCES, READING_STATUS };

export const UNITS = { [IICS_U1.id]: IICS_U1 };

/** Concepto por id, con la unidad y la sección donde se estudia. */
export const CONCEPTS = {};
for (const unit of Object.values(UNITS)) {
  for (const c of unit.concepts) {
    const section = unit.sections.find((s) => s.concepts.includes(c.id));
    CONCEPTS[c.id] = { ...c, unitId: unit.id, sectionId: section?.id ?? null };
  }
}

export const subjectOf = (unit) => SUBJECTS.find((s) => s.id === unit.subjectId);
