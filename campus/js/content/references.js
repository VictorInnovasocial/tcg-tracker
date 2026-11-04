// Referencias académicas. Son obras reales y ampliamente citadas en metodología de la investigación,
// pero los datos bibliográficos se han redactado sin acceso a internet: comprueba la edición en el
// catálogo de la Biblioteca de la UEx antes de citarlas en un trabajo.
// Los enlaces son búsquedas en catálogos públicos, no enlaces al texto completo.

const worldcat = (q) => `https://search.worldcat.org/search?q=${encodeURIComponent(q)}`;

export const REFERENCES = [
  {
    id: 'hernandez-mendoza-2018',
    apa: 'Hernández-Sampieri, R., & Mendoza Torres, C. P. (2018). <em>Metodología de la investigación: Las rutas cuantitativa, cualitativa y mixta</em>. McGraw-Hill Interamericana.',
    title: 'Metodología de la investigación: Las rutas cuantitativa, cualitativa y mixta',
    year: 2018,
    lang: 'es',
    use: 'Manual de referencia para toda la unidad: planteamiento del problema, objetivos, preguntas e hipótesis en las tres rutas.',
    url: worldcat('Hernández-Sampieri Mendoza Metodología de la investigación rutas cuantitativa cualitativa mixta'),
  },
  {
    id: 'hernandez-2014',
    apa: 'Hernández Sampieri, R., Fernández Collado, C., & Baptista Lucio, M. P. (2014). <em>Metodología de la investigación</em> (6.ª ed.). McGraw-Hill.',
    title: 'Metodología de la investigación (6.ª ed.)',
    year: 2014,
    lang: 'es',
    use: 'Edición anterior, muy presente en bibliotecas. Capítulos sobre planteamiento del problema e hipótesis.',
    url: worldcat('Hernández Sampieri Fernández Baptista Metodología de la investigación 6 edición'),
  },
  {
    id: 'creswell-2018',
    apa: 'Creswell, J. W., & Creswell, J. D. (2018). <em>Research design: Qualitative, quantitative, and mixed methods approaches</em> (5th ed.). SAGE.',
    title: 'Research design (5th ed.)',
    year: 2018,
    lang: 'en',
    use: 'Capítulos sobre propósito del estudio, preguntas e hipótesis según el enfoque.',
    url: worldcat('Creswell Research design qualitative quantitative mixed methods 5th'),
  },
  {
    id: 'bisquerra-2004',
    apa: 'Bisquerra Alzina, R. (Coord.). (2004). <em>Metodología de la investigación educativa</em>. La Muralla.',
    title: 'Metodología de la investigación educativa',
    year: 2004,
    lang: 'es',
    use: 'Manual clásico en las facultades de educación españolas. El proceso de investigación y la formulación del problema.',
    url: worldcat('Bisquerra Metodología de la investigación educativa La Muralla 2004'),
  },
  {
    id: 'mcmillan-2005',
    apa: 'McMillan, J. H., & Schumacher, S. (2005). <em>Investigación educativa: Una introducción conceptual</em> (5.ª ed.). Pearson Educación.',
    title: 'Investigación educativa: Una introducción conceptual',
    year: 2005,
    lang: 'es',
    use: 'Problemas de investigación y su formulación en investigación educativa cuantitativa y cualitativa.',
    url: worldcat('McMillan Schumacher Investigación educativa una introducción conceptual'),
  },
  {
    id: 'cohen-2018',
    apa: 'Cohen, L., Manion, L., & Morrison, K. (2018). <em>Research methods in education</em> (8th ed.). Routledge.',
    title: 'Research methods in education (8th ed.)',
    year: 2018,
    lang: 'en',
    use: 'Referencia internacional en investigación educativa: planificación, preguntas e hipótesis.',
    url: worldcat('Cohen Manion Morrison Research methods in education 8th edition'),
  },
  {
    id: 'corbetta-2007',
    apa: 'Corbetta, P. (2007). <em>Metodología y técnicas de investigación social</em> (ed. rev.). McGraw-Hill.',
    title: 'Metodología y técnicas de investigación social',
    year: 2007,
    lang: 'es',
    use: 'Enfoque desde la sociología: teoría, hipótesis y variables; paradigmas de la investigación social.',
    url: worldcat('Corbetta Metodología y técnicas de investigación social'),
  },
  {
    id: 'hulley-2013',
    apa: 'Hulley, S. B., Cummings, S. R., Browner, W. S., Grady, D. G., & Newman, T. B. (2013). <em>Designing clinical research</em> (4th ed.). Lippincott Williams & Wilkins.',
    title: 'Designing clinical research (4th ed.)',
    year: 2013,
    lang: 'en',
    use: 'Origen de los criterios FINER para valorar una pregunta de investigación. Es un manual de investigación clínica; aquí solo se usa ese criterio.',
    url: worldcat('Hulley Designing clinical research 4th edition'),
  },
  {
    id: 'popper-1980',
    apa: 'Popper, K. R. (1980). <em>La lógica de la investigación científica</em> (V. Sánchez de Zavala, Trad.). Tecnos. (Obra original publicada en 1934)',
    title: 'La lógica de la investigación científica',
    year: 1980,
    lang: 'es',
    use: 'Fuente primaria del criterio de falsabilidad. Lectura exigente: basta con el planteamiento general.',
    url: worldcat('Popper La lógica de la investigación científica Tecnos'),
  },
  {
    id: 'apa-2020',
    apa: 'American Psychological Association. (2020). <em>Publication manual of the American Psychological Association</em> (7th ed.).',
    title: 'Manual de publicaciones APA (7.ª ed.)',
    year: 2020,
    lang: 'en',
    use: 'Norma de citación habitual en ciencias sociales y educación. Necesaria para todo el máster.',
    url: 'https://apastyle.apa.org/',
  },
];

export const READING_STATUS = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'localizada', label: 'Localizada en biblioteca' },
  { id: 'leyendo', label: 'Leyendo' },
  { id: 'leida', label: 'Leída' },
];
