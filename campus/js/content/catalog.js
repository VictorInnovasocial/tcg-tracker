// Catálogo del Máster Universitario en Investigación en Ciencias Sociales (UEx), plan modificado 2026/2027.
// Los datos de estructura proceden de lo indicado por el estudiante a partir de las fuentes oficiales
// enlazadas abajo. NO se han podido contrastar automáticamente: cada asignatura lleva un estado de
// verificación que el estudiante actualiza en la propia aplicación al consultar la guía docente.

export const PROGRAM = {
  name: 'Máster Universitario en Investigación en Ciencias Sociales',
  university: 'Universidad de Extremadura',
  centre: 'Facultad de Formación del Profesorado (Cáceres)',
  specialty: 'Ciencias de la Educación',
  plan: 'Plan modificado 2026/2027',
  targetYear: '2027/2028',
  ects: { total: 60, mandatory: 12, optional: 36, tfm: 12 },
  sources: [
    { label: 'Página de la titulación (UEx)', url: 'https://profesorado.unex.es/titulaciones/0727/' },
    { label: 'Publicación oficial en el BOE (BOE-A-2026-20259)', url: 'https://boe.es/diario_boe/txt.php?id=BOE-A-2026-20259' },
  ],
  dataStatus: 'Estructura facilitada por el estudiante a partir de las fuentes oficiales. Pendiente de cotejar con el BOE.',
};

export const SUBJECTS = [
  { id: 'iics', name: 'Iniciación a la Investigación en Ciencias Sociales', type: 'obligatoria', interest: true, units: ['iics-u1'] },
  { id: 'tcdc', name: 'Tecnologías de la Comunicación y la Documentación Científica', type: 'obligatoria', interest: true, units: [] },
  { id: 'tics', name: 'Iniciación a la Investigación en TICS aplicadas a la Educación', type: 'optativa', interest: true, units: [] },
  { id: 'fprof', name: 'Iniciación a la Investigación en Formación del Profesorado y otros Profesionales de la Educación', type: 'optativa', interest: true, units: [] },
  { id: 'dcs', name: 'Iniciación a la Investigación en Didáctica de las Ciencias Sociales', type: 'optativa', interest: true, units: [] },
  { id: 'thc', name: 'Iniciación a la Investigación Teórica, Histórica y Comparada de la Educación', type: 'optativa', interest: true, units: [] },
  { id: 'tfm', name: 'Trabajo Fin de Máster', type: 'tfm', interest: true, units: [] },
];
