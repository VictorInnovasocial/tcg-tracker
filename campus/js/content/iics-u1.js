// Unidad 1 de «Iniciación a la Investigación en Ciencias Sociales».
// MATERIAL DE ESTUDIO ELABORADO CON IA. No es el programa oficial de la asignatura:
// se ha redactado a partir de manuales de metodología reconocidos (ver `references`)
// y debe contrastarse con la guía docente oficial cuando esté disponible.

export const UNIT = {
  id: 'iics-u1',
  subjectId: 'iics',
  number: 1,
  title: 'El problema de investigación, la pregunta, los objetivos y las hipótesis',
  summary:
    'Cómo se pasa de un tema de interés a un problema investigable, cómo se formula una pregunta que pueda responderse con datos, cómo se derivan objetivos de investigación (no de intervención) y cuándo y cómo se formulan hipótesis contrastables.',
  estimatedHours: 6,
  outcomes: [
    'Distinguir un tema, un problema social y un problema de investigación.',
    'Formular y depurar preguntas de investigación delimitadas y respondibles empíricamente.',
    'Redactar un objetivo general y objetivos específicos coherentes con la pregunta.',
    'Diferenciar objetivos de investigación de objetivos de intervención socioeducativa.',
    'Decidir si un estudio requiere hipótesis y formularlas de forma contrastable.',
    'Comprobar la coherencia interna de un planteamiento mediante una matriz de consistencia.',
  ],

  // Conceptos: cada uno genera una tarjeta de repaso espaciado y es la unidad de registro de errores.
  concepts: [
    { id: 'tema-vs-problema', term: 'Tema y problema de investigación', front: '¿Qué diferencia un tema de un problema de investigación?', back: 'El tema es un área amplia de interés («la brecha digital en personas mayores»). El problema de investigación concreta qué no se sabe sobre una situación determinada y por qué importa saberlo. Un tema no se puede investigar directamente; un problema, sí.' },
    { id: 'elementos-problema', term: 'Componentes del problema', front: '¿Cuáles son los tres componentes de un problema de investigación bien planteado?', back: '1) Una situación o fenómeno observado en un contexto concreto. 2) Un vacío de conocimiento: lo que no se sabe, datos que faltan o resultados contradictorios. 3) La relevancia: por qué importa resolver ese vacío (teórica, práctica o social).' },
    { id: 'problema-social', term: 'Problema social vs. de investigación', front: '¿Por qué el absentismo escolar, por sí solo, no es un problema de investigación?', back: 'Es un problema social: una situación que se quiere cambiar. El problema de investigación es lo que desconocemos sobre él (por ejemplo, qué factores asocian las familias al absentismo en un barrio concreto). Intervenir busca cambiar la realidad; investigar busca conocerla.' },
    { id: 'criterios-finer', term: 'Criterios FINER', front: '¿Qué significan las siglas FINER para valorar una pregunta?', back: 'Factible, Interesante, Novedosa, Ética y Relevante (Hulley et al., 2013). En un TFM pesa mucho la factibilidad: tiempo, acceso a participantes, permisos y competencias del investigador.' },
    { id: 'pregunta-investigable', term: 'Pregunta investigable', front: '¿Qué requisitos debe cumplir una pregunta para ser investigable?', back: 'Es empírica (se responde con datos, no con valores: evita «¿debería…?»), está delimitada, usa conceptos que se pueden definir y observar, no es trivial ni está ya resuelta, no presupone la respuesta y es factible.' },
    { id: 'delimitacion', term: 'Delimitación', front: '¿Qué cuatro elementos delimitan una pregunta de investigación?', back: 'Quién (población o participantes), qué (fenómeno o variables), dónde (contexto o ámbito) y cuándo (periodo temporal).' },
    { id: 'tipos-pregunta', term: 'Tipos de pregunta', front: 'Nombra cinco tipos de pregunta de investigación y qué anticipan.', back: 'Descriptiva (¿cómo es / cuánto?), comparativa (¿difiere entre grupos?), relacional (¿qué relación hay entre X e Y?), causal o explicativa (¿qué efecto tiene X sobre Y?, exige diseños que permitan inferir causalidad) y comprensiva o interpretativa (¿cómo viven o interpretan…?, típica del enfoque cualitativo). El tipo de pregunta anticipa el enfoque y el diseño.' },
    { id: 'objetivo-general', term: 'Objetivo general', front: '¿Qué expresa el objetivo general de una investigación y cómo se redacta?', back: 'El conocimiento que la investigación pretende producir. Deriva directamente de la pregunta y mantiene su fenómeno, población y contexto. Se redacta en infinitivo con un verbo cognitivo: «Analizar la relación entre…».' },
    { id: 'objetivos-especificos', term: 'Objetivos específicos', front: '¿Qué relación tienen los objetivos específicos con el general?', back: 'Desglosan el general en logros parciales de conocimiento. Si se alcanzan todos, se alcanza el general. No son actividades ni procedimientos: «aplicar un cuestionario» pertenece al método.' },
    { id: 'investigacion-vs-intervencion', term: 'Objetivo de investigación vs. de intervención', front: '¿Por qué «Fomentar la participación de las familias» no es un objetivo de investigación?', back: 'Porque expresa un cambio que se quiere provocar en la realidad (intervención), no un conocimiento que se quiere obtener. Su versión investigadora sería, por ejemplo, «Analizar los factores que facilitan o dificultan la participación de las familias…». Evaluar los efectos de un programa sí es investigación (investigación evaluativa).' },
    { id: 'verbos-objetivos', term: 'Verbos de los objetivos', front: 'Da verbos adecuados e inadecuados para objetivos de investigación.', back: 'Adecuados: explorar, describir, identificar, comparar, analizar, relacionar, explicar, comprender, interpretar, evaluar. Inadecuados: mejorar, fomentar, promover, sensibilizar, implementar (son de intervención) y demostrar o confirmar (presuponen el resultado).' },
    { id: 'hipotesis-definicion', term: 'Hipótesis', front: '¿Qué es una hipótesis de investigación?', back: 'Una respuesta tentativa a la pregunta de investigación que enuncia la relación esperada entre variables (o el valor esperado de una variable), fundamentada en teoría o estudios previos y que puede contrastarse con datos.' },
    { id: 'cuando-hipotesis', term: 'Cuándo se formulan hipótesis', front: '¿En qué estudios se formulan hipótesis y en cuáles no?', back: 'Se formulan en estudios cuantitativos correlacionales y explicativos, y en descriptivos solo si se pronostica un dato. No se formulan en estudios exploratorios. En la investigación cualitativa no suelen plantearse de antemano; pueden emerger durante el estudio.' },
    { id: 'tipos-hipotesis', term: 'Tipos de hipótesis', front: 'Distingue hipótesis de investigación, nula y alternativa, y direccional frente a no direccional.', back: 'Hi: la relación que el investigador espera. H0 (nula): niega la relación o diferencia; es la que se somete a contraste estadístico. H1 (alternativa): la que se acepta si se rechaza H0. Direccional: indica el sentido («mayor que»). No direccional: solo afirma que hay diferencia o relación.' },
    { id: 'variables', term: 'Variables independiente y dependiente', front: '¿Qué son la variable independiente y la dependiente?', back: 'La independiente (VI) es el factor que se supone que influye o que se manipula (p. ej., participar o no en un programa). La dependiente (VD) es el resultado que se mide para ver si cambia en función de la VI (p. ej., la puntuación en autoestima).' },
    { id: 'falsabilidad', term: 'Falsabilidad', front: '¿Qué significa que una hipótesis debe ser falsable?', back: 'Que debe estar formulada de modo que unos datos observables puedan mostrar que es falsa (Popper). «La educación social mejora la sociedad» no es falsable así escrita: no dice qué se observaría si fuera falsa. Por eso los datos no «demuestran» una hipótesis: como mucho, no la refutan.' },
    { id: 'coherencia', term: 'Coherencia interna', front: '¿Qué es la matriz de consistencia y qué comprueba?', back: 'Una tabla que alinea problema → pregunta → objetivo general → objetivos específicos (y preguntas específicas) → hipótesis, si proceden → variables o categorías → método. Comprueba que cada elemento deriva del anterior sin cambiar de población, fenómeno ni alcance.' },
  ],

  sections: [
    {
      id: 's1',
      title: 'Del tema al problema de investigación',
      minutes: 35,
      concepts: ['tema-vs-problema', 'elementos-problema', 'problema-social', 'criterios-finer'],
      body: `
<p>Toda investigación empieza por un <strong>tema</strong>: un área de interés amplia, como «la soledad no deseada en personas mayores» o «el uso de la tecnología en el aula». Un tema no se puede investigar directamente porque no dice <em>qué es lo que no sabemos</em>. Para eso hay que convertirlo en un <strong>problema de investigación</strong>.</p>

<h3>Qué es un problema de investigación</h3>
<p>Es la formulación de un vacío o una tensión en el conocimiento sobre una situación concreta, que justifica producir conocimiento nuevo. Un problema bien planteado tiene tres componentes:</p>
<ol>
  <li><strong>Situación o fenómeno</strong> observado en un contexto determinado (quiénes, dónde, cuándo).</li>
  <li><strong>Vacío de conocimiento</strong>: lo que no se sabe. Puede ser que falten datos en ese contexto, que los estudios previos se contradigan o que una explicación habitual no encaje con lo observado.</li>
  <li><strong>Relevancia</strong>: por qué importa resolver ese vacío. Puede ser teórica (mejora una explicación), práctica (orienta decisiones profesionales) o social (afecta a derechos o al bienestar de un colectivo).</li>
</ol>

<h3>Problema social no es lo mismo que problema de investigación</h3>
<p>Esta distinción es clave viniendo de la Educación Social. El absentismo escolar, la exclusión residencial o la brecha digital son <strong>problemas sociales</strong>: situaciones que queremos cambiar. Un <strong>problema de investigación</strong> es lo que <em>desconocemos</em> sobre ellos. «Hay mucho absentismo en el barrio» describe un problema social; «no sabemos qué factores asocian las familias del barrio al absentismo, y sin ese conocimiento los programas se diseñan a ciegas» plantea un problema de investigación.</p>

<h3>De dónde salen los problemas</h3>
<ul>
  <li>De la <strong>práctica profesional</strong>: algo que se repite y nadie sabe explicar.</li>
  <li>De la <strong>literatura científica</strong>: los apartados de limitaciones y de líneas futuras de los artículos señalan vacíos explícitos.</li>
  <li>De <strong>contradicciones</strong> entre estudios o entre la teoría y lo que se observa.</li>
  <li>De <strong>cambios normativos o tecnológicos</strong> recientes cuyos efectos aún no se han estudiado.</li>
</ul>
<p>Sin revisar la literatura no se puede afirmar que algo sea un vacío: quizá ya está respondido. Por eso la revisión bibliográfica no es un paso posterior, sino parte del planteamiento del problema.</p>

<h3>Criterios para valorar un problema: FINER</h3>
<p>Hulley y colaboradores (2013) proponen cinco criterios, muy útiles para un trabajo fin de máster:</p>
<table>
  <thead><tr><th>Criterio</th><th>Pregunta de control</th></tr></thead>
  <tbody>
    <tr><td><strong>F</strong>actible</td><td>¿Puedo hacerlo con el tiempo, el acceso a participantes, los permisos y las competencias que tengo? Un TFM de 12 ECTS supone, como referencia, unas 300–360 horas de trabajo.</td></tr>
    <tr><td><strong>I</strong>nteresante</td><td>¿Me interesa lo bastante para sostenerlo meses? ¿Interesa a la comunidad científica o profesional?</td></tr>
    <tr><td><strong>N</strong>ovedoso</td><td>¿Aporta algo: un contexto no estudiado, una población distinta, una contradicción que aclarar?</td></tr>
    <tr><td><strong>É</strong>tico</td><td>¿Respeta el consentimiento informado, la confidencialidad y la protección de personas vulnerables?</td></tr>
    <tr><td><strong>R</strong>elevante</td><td>¿Sus resultados podrían cambiar la teoría, la práctica profesional o las políticas?</td></tr>
  </tbody>
</table>`,
      examples: [
        {
          title: 'Ejemplo guiado: de tema a problema',
          body: `
<p><strong>Tema:</strong> la alfabetización digital de las personas mayores.</p>
<p><strong>Primer intento (sigue siendo un tema):</strong> «Las personas mayores y las nuevas tecnologías».</p>
<p><strong>Problema social (todavía no es de investigación):</strong> «Muchas personas mayores no saben pedir cita médica por internet».</p>
<p><strong>Problema de investigación:</strong> «Los centros de mayores de una ciudad ofrecen talleres gratuitos de competencia digital, pero una parte importante de las personas inscritas los abandona antes de terminar. Las evaluaciones de los talleres solo recogen la satisfacción de quienes acaban, de modo que se desconocen los motivos del abandono. Sin ese conocimiento no es posible ajustar el diseño de los talleres a las necesidades de quienes más los necesitan».</p>
<p>Fíjate en los tres componentes: situación (talleres y abandono en un contexto), vacío (no se conocen los motivos porque nadie pregunta a quien abandona) y relevancia (ajustar la oferta).</p>`,
        },
      ],
      recall: {
        prompt: 'Sin mirar el texto: ¿qué diferencia un tema de un problema de investigación? Enumera los tres componentes de un problema bien planteado, explica por qué un problema social no es todavía un problema de investigación y di qué significa cada letra de FINER.',
        model: 'Un tema es un área amplia; un problema de investigación concreta qué no se sabe sobre una situación y por qué importa. Componentes: situación en un contexto, vacío de conocimiento y relevancia. Un problema social es una situación que se quiere cambiar; el problema de investigación es lo que no sabemos de ella. FINER: factible, interesante, novedoso, ético y relevante.',
        checklist: [
          { concept: 'tema-vs-problema', text: 'He distinguido tema (área amplia) de problema (vacío concreto).' },
          { concept: 'elementos-problema', text: 'He nombrado situación, vacío de conocimiento y relevancia.' },
          { concept: 'problema-social', text: 'He explicado la diferencia entre problema social y problema de investigación.' },
          { concept: 'criterios-finer', text: 'He recordado las cinco letras de FINER y su significado.' },
        ],
      },
    },
    {
      id: 's2',
      title: 'La pregunta de investigación',
      minutes: 40,
      concepts: ['pregunta-investigable', 'delimitacion', 'tipos-pregunta'],
      body: `
<p>La pregunta de investigación traduce el problema a algo que se puede <strong>responder con datos</strong>. Es la pieza que más condiciona el resto del trabajo: de ella dependen los objetivos, el enfoque, el diseño, la muestra y los instrumentos.</p>

<h3>Requisitos de una pregunta investigable</h3>
<ol>
  <li><strong>Empírica.</strong> Se responde observando, preguntando o midiendo, no con valores. «¿Debería prohibirse el móvil en los institutos?» es una pregunta <em>normativa</em>: la respuesta depende de juicios de valor. Su versión investigable podría ser «¿Qué relación existe entre las normas de uso del móvil de los institutos y…?».</li>
  <li><strong>Delimitada.</strong> Especifica <em>quién</em> (población), <em>qué</em> (fenómeno o variables), <em>dónde</em> (contexto) y <em>cuándo</em> (periodo).</li>
  <li><strong>Con conceptos definibles y observables.</strong> «Éxito», «bienestar» o «uso de la tecnología» deben poder concretarse: ¿qué se observaría o mediría?</li>
  <li><strong>No trivial ni ya resuelta.</strong> Si la respuesta es obvia o la literatura ya la ha dado, no hay problema que investigar. Las preguntas que se contestan con un simple sí o no suelen quedarse cortas.</li>
  <li><strong>Neutral.</strong> No presupone la respuesta. «¿Por qué el móvil empeora el rendimiento?» da por hecho que lo empeora.</li>
  <li><strong>Factible.</strong> Se puede responder con los recursos y el tiempo disponibles.</li>
</ol>

<h3>Tipos de pregunta</h3>
<table>
  <thead><tr><th>Tipo</th><th>Forma típica</th><th>Qué anticipa</th></tr></thead>
  <tbody>
    <tr><td>Descriptiva</td><td>¿Cómo es…? ¿Cuál es el nivel de…? ¿Con qué frecuencia…?</td><td>Encuestas, análisis de datos existentes; enfoque cuantitativo o cualitativo.</td></tr>
    <tr><td>Comparativa</td><td>¿Difiere… entre A y B?</td><td>Comparación de grupos ya existentes.</td></tr>
    <tr><td>Relacional</td><td>¿Qué relación existe entre X e Y?</td><td>Estudios correlacionales; no permiten afirmar causalidad.</td></tr>
    <tr><td>Causal o explicativa</td><td>¿Qué efecto tiene X sobre Y?</td><td>Diseños experimentales o cuasiexperimentales, que controlan otras explicaciones.</td></tr>
    <tr><td>Comprensiva o interpretativa</td><td>¿Cómo viven, interpretan o construyen…?</td><td>Enfoque cualitativo: entrevistas, grupos de discusión, observación.</td></tr>
  </tbody>
</table>
<p>Un error frecuente es plantear una pregunta causal («¿qué efecto tiene…?») y después usar un diseño que solo permite describir o correlacionar. El tipo de pregunta obliga.</p>`,
      examples: [
        {
          title: 'Ejemplo guiado: depurar una pregunta en tres pasos',
          body: `
<p><strong>Versión 1:</strong> «¿Cómo afecta la tecnología a la educación?» — Demasiado amplia: ni población, ni contexto, ni qué tecnología ni qué aspecto de la educación.</p>
<p><strong>Versión 2:</strong> «¿Cómo afecta el aula virtual al rendimiento del alumnado de secundaria?» — Mejor, pero «afecta» exige un diseño causal difícil en un TFM y falta contexto y periodo.</p>
<p><strong>Versión 3:</strong> «¿Qué relación existe entre la frecuencia de acceso al aula virtual y las calificaciones de Matemáticas del alumnado de 4.º de ESO de dos institutos públicos de Cáceres durante el curso 2027/28?» — Empírica, delimitada (quién, qué, dónde, cuándo), neutral, de tipo relacional y factible si se obtienen los permisos de acceso a los datos.</p>
<p><strong>Alternativa cualitativa:</strong> «¿Cómo describe el alumnado de 4.º de ESO de esos institutos su experiencia de estudio con el aula virtual?» — Comprensiva: pide entrevistas o grupos de discusión, no correlaciones.</p>`,
        },
      ],
      recall: {
        prompt: 'Escribe de memoria los requisitos de una pregunta investigable y los cuatro elementos de delimitación. Después inventa una pregunta relacional sobre tu ámbito profesional y di qué tipo de diseño anticipa.',
        model: 'Requisitos: empírica (no normativa), delimitada, con conceptos definibles y observables, no trivial ni resuelta, neutral (no presupone la respuesta) y factible. Delimitación: quién, qué, dónde y cuándo. Una pregunta relacional («¿Qué relación existe entre X e Y en tal población, contexto y periodo?») anticipa un estudio correlacional, que no permite afirmar causalidad.',
        checklist: [
          { concept: 'pregunta-investigable', text: 'He recordado al menos cuatro requisitos, incluidos «empírica» y «neutral».' },
          { concept: 'delimitacion', text: 'He nombrado quién, qué, dónde y cuándo.' },
          { concept: 'tipos-pregunta', text: 'He relacionado el tipo de pregunta con el diseño que exige.' },
        ],
      },
    },
    {
      id: 's3',
      title: 'Los objetivos de investigación',
      minutes: 35,
      concepts: ['objetivo-general', 'objetivos-especificos', 'investigacion-vs-intervencion', 'verbos-objetivos'],
      body: `
<p>Los objetivos expresan <strong>qué conocimiento</strong> va a producir la investigación. Son la pregunta convertida en meta.</p>

<h3>Objetivo general</h3>
<p>Normalmente es uno. Deriva directamente de la pregunta y conserva su fenómeno, población, contexto y periodo. Se redacta en infinitivo con un verbo cognitivo:</p>
<p class="formula">Verbo cognitivo + fenómeno o relación + población + contexto + (periodo)</p>

<h3>Objetivos específicos</h3>
<p>Desglosan el general en logros parciales de conocimiento. Prueba de control: <em>si alcanzo todos los específicos, ¿he alcanzado el general?</em> Si la respuesta es no, falta alguno; si alguno no contribuye al general, sobra. Para un TFM, tres o cuatro suelen bastar.</p>
<p>Los objetivos específicos <strong>no son actividades</strong>. «Diseñar un cuestionario», «realizar entrevistas» o «revisar la bibliografía» son pasos del método, no conocimiento que se obtiene.</p>

<h3>Investigar no es intervenir</h3>
<p>En la Educación Social estamos acostumbrados a redactar objetivos de proyectos de intervención: <em>mejorar, fomentar, promover, sensibilizar, reducir</em>. Esos verbos expresan un <strong>cambio que se quiere provocar</strong> en la realidad. Un objetivo de investigación expresa un <strong>conocimiento que se quiere obtener</strong> sobre ella.</p>
<table>
  <thead><tr><th>Objetivo de intervención</th><th>Objetivo de investigación relacionado</th></tr></thead>
  <tbody>
    <tr><td>Reducir el absentismo del alumnado del barrio.</td><td>Analizar los factores que el alumnado y sus familias asocian al absentismo en el barrio.</td></tr>
    <tr><td>Fomentar la participación de las familias en el centro.</td><td>Identificar las barreras que perciben las familias para participar en el centro.</td></tr>
    <tr><td>Implantar un programa de mentoría.</td><td>Evaluar el efecto del programa de mentoría sobre la permanencia escolar.</td></tr>
  </tbody>
</table>
<p>Observa la última fila: <strong>evaluar</strong> un programa sí es investigación (investigación evaluativa), porque el objetivo es saber si funciona, no hacer que funcione.</p>

<h3>Verbos</h3>
<p><strong>Adecuados</strong>, de menor a mayor profundidad: explorar, describir, identificar, comparar, analizar, relacionar, explicar, comprender, interpretar, evaluar.</p>
<p><strong>A evitar</strong>: los de intervención (mejorar, fomentar, promover, concienciar, implementar) y los que presuponen el resultado (demostrar, confirmar, probar que).</p>`,
      examples: [
        {
          title: 'Ejemplo guiado: de la pregunta a los objetivos',
          body: `
<p><strong>Pregunta:</strong> ¿Qué relación existe entre el apoyo familiar percibido y la intención de abandonar los estudios del alumnado de 4.º de ESO de los institutos públicos de Mérida en el curso 2027/28?</p>
<p><strong>Objetivo general:</strong> Analizar la relación entre el apoyo familiar percibido y la intención de abandono escolar del alumnado de 4.º de ESO de los institutos públicos de Mérida en el curso 2027/28.</p>
<p><strong>Objetivos específicos:</strong></p>
<ol>
  <li>Describir el nivel de apoyo familiar percibido por ese alumnado.</li>
  <li>Describir la intención de abandono escolar de ese alumnado.</li>
  <li>Analizar la relación entre ambas variables.</li>
  <li>Comparar esa relación según el sexo y el nivel educativo de las familias.</li>
</ol>
<p>Prueba de control: con 1, 2 y 3 se alcanza el general; el 4 lo matiza. No aparece ninguna actividad («pasar un cuestionario») ni ningún verbo de intervención.</p>`,
        },
      ],
      recall: {
        prompt: 'Sin mirar: explica la diferencia entre objetivo general y objetivos específicos, describe la prueba de control entre ambos, explica por qué «Fomentar la participación de las familias» no es un objetivo de investigación y escribe tres verbos adecuados y dos que debas evitar.',
        model: 'El general expresa el conocimiento global que se busca y deriva de la pregunta; los específicos lo desglosan en logros parciales. Prueba: si se alcanzan todos los específicos, se alcanza el general. «Fomentar» expresa un cambio en la realidad (intervención), no un conocimiento. Adecuados: describir, analizar, comparar. A evitar: mejorar, demostrar.',
        checklist: [
          { concept: 'objetivo-general', text: 'He explicado que el general deriva de la pregunta y mantiene población y contexto.' },
          { concept: 'objetivos-especificos', text: 'He descrito la prueba de control y que los específicos no son actividades.' },
          { concept: 'investigacion-vs-intervencion', text: 'He distinguido conocer (investigar) de cambiar (intervenir).' },
          { concept: 'verbos-objetivos', text: 'He dado verbos adecuados e inadecuados correctos.' },
        ],
      },
    },
    {
      id: 's4',
      title: 'Las hipótesis',
      minutes: 45,
      concepts: ['hipotesis-definicion', 'cuando-hipotesis', 'tipos-hipotesis', 'variables', 'falsabilidad'],
      body: `
<p>Una <strong>hipótesis</strong> es una respuesta tentativa a la pregunta de investigación. Enuncia la relación que se espera encontrar entre variables (o el valor esperado de una variable), se apoya en la teoría o en estudios previos y se formula de modo que los datos puedan contrastarla.</p>

<h3>¿Siempre hay hipótesis? No</h3>
<ul>
  <li><strong>Sí</strong> en estudios cuantitativos <strong>correlacionales y explicativos</strong>: hay una relación que contrastar.</li>
  <li>En estudios <strong>descriptivos</strong>, solo si se pronostica un dato (por ejemplo, un porcentaje esperado).</li>
  <li><strong>No</strong> en estudios <strong>exploratorios</strong>: si apenas se sabe nada, no hay base para anticipar.</li>
  <li>En la investigación <strong>cualitativa</strong> no suelen formularse de antemano; pueden emerger y refinarse durante el estudio.</li>
</ul>
<p>Formular hipótesis porque «queda bien» en un estudio cualitativo o exploratorio es un error de coherencia.</p>

<h3>Variables</h3>
<p>La <strong>variable independiente (VI)</strong> es el factor que se supone que influye, o que el investigador manipula. La <strong>variable dependiente (VD)</strong> es el resultado que se mide para ver si cambia en función de la VI. En los estudios correlacionales, donde no se afirma causalidad, a menudo se habla simplemente de variables asociadas. Las <strong>variables extrañas</strong> son otros factores que podrían explicar el resultado y conviene controlar.</p>

<h3>Tipos de hipótesis</h3>
<table>
  <thead><tr><th>Tipo</th><th>Qué afirma</th><th>Ejemplo</th></tr></thead>
  <tbody>
    <tr><td>De investigación (Hi)</td><td>La relación que el investigador espera.</td><td>El alumnado que participa en la tutoría entre iguales obtiene mayor puntuación en autoestima que el que no participa.</td></tr>
    <tr><td>Nula (H0)</td><td>Que no hay relación ni diferencia. Es la que se somete a contraste estadístico.</td><td>No hay diferencias en autoestima entre quienes participan y quienes no.</td></tr>
    <tr><td>Alternativa (H1)</td><td>La que se acepta si se rechaza la nula.</td><td>Hay diferencias en autoestima entre ambos grupos.</td></tr>
  </tbody>
</table>
<p>Además, una hipótesis es <strong>direccional</strong> si indica el sentido («mayor que», «a más… menos…») y <strong>no direccional</strong> si solo afirma que existe diferencia o relación.</p>

<h3>Falsabilidad</h3>
<p>Para Popper, un enunciado es científico si puede ser <strong>refutado</strong> por la experiencia. «La educación social mejora la sociedad» no es falsable así escrita: no dice qué observaríamos si fuera falsa. Por eso los datos no «demuestran» una hipótesis: o la refutan, o no la refutan y la hipótesis se sostiene provisionalmente. En términos estadísticos, se rechaza o no se rechaza H0 con un determinado nivel de probabilidad.</p>

<h3>Requisitos de una buena hipótesis</h3>
<ul>
  <li>Se refiere a una situación real y a la población del estudio.</li>
  <li>Sus variables son precisas y observables o medibles.</li>
  <li>La relación entre variables es clara y lógicamente plausible.</li>
  <li>Está fundamentada en teoría o en resultados previos, no en una intuición suelta.</li>
</ul>`,
      examples: [
        {
          title: 'Ejemplo guiado: anatomía de una hipótesis',
          body: `
<p><strong>Pregunta:</strong> ¿Difiere la competencia digital docente autopercibida entre el profesorado de primaria de centros rurales y urbanos de la provincia de Badajoz?</p>
<p><strong>Hi (no direccional):</strong> Existen diferencias en la competencia digital docente autopercibida entre el profesorado de primaria de centros rurales y el de centros urbanos.</p>
<p><strong>H0:</strong> No existen diferencias en la competencia digital docente autopercibida entre ambos grupos.</p>
<p><strong>VI:</strong> tipo de centro (rural / urbano). <strong>VD:</strong> puntuación en un cuestionario de competencia digital docente autopercibida.</p>
<p><strong>Por qué no direccional:</strong> si los estudios previos dan resultados contradictorios, no hay base para anticipar qué grupo puntuará más. Si la literatura apuntara claramente en un sentido, la hipótesis podría ser direccional.</p>
<p><strong>Variables extrañas a considerar:</strong> años de experiencia docente, formación recibida, dotación tecnológica del centro.</p>`,
        },
      ],
      recall: {
        prompt: 'Define hipótesis con tus palabras. Di en qué tipos de estudio se formulan y en cuáles no. Distingue Hi, H0 y H1, y direccional de no direccional. Explica qué hace falsable una hipótesis y qué son la VI y la VD.',
        model: 'Respuesta tentativa a la pregunta, que enuncia una relación esperada entre variables, fundamentada y contrastable. Se formulan en estudios cuantitativos correlacionales y explicativos; no en exploratorios ni, normalmente, de antemano en los cualitativos. Hi: la esperada; H0: niega la relación y se contrasta; H1: se acepta si se rechaza H0. Direccional indica el sentido. Es falsable si unos datos observables podrían refutarla. VI: factor que influye; VD: resultado medido.',
        checklist: [
          { concept: 'hipotesis-definicion', text: 'He definido hipótesis como respuesta tentativa, fundamentada y contrastable.' },
          { concept: 'cuando-hipotesis', text: 'He indicado que no se formulan en estudios exploratorios ni, de antemano, en cualitativos.' },
          { concept: 'tipos-hipotesis', text: 'He distinguido Hi, H0, H1 y direccional / no direccional.' },
          { concept: 'falsabilidad', text: 'He explicado la falsabilidad y por qué los datos no «demuestran».' },
          { concept: 'variables', text: 'He definido VI y VD correctamente.' },
        ],
      },
    },
    {
      id: 's5',
      title: 'La coherencia: matriz de consistencia',
      minutes: 30,
      concepts: ['coherencia'],
      body: `
<p>Los elementos que has estudiado no se redactan por separado: forman una <strong>cadena</strong> en la que cada pieza deriva de la anterior.</p>
<p class="formula">Problema → Pregunta general → Objetivo general → Preguntas y objetivos específicos → Hipótesis (si proceden) → Variables o categorías → Método</p>
<p>La <strong>matriz de consistencia</strong> es una tabla que coloca estos elementos en paralelo para comprobar que encajan. Es una herramienta de trabajo, no un apartado obligatorio del TFM, pero ahorra muchos errores y es útil para hablar con quien tutorice el trabajo.</p>

<h3>Errores de coherencia frecuentes</h3>
<ol>
  <li><strong>Cambio de población o contexto</strong>: la pregunta habla del alumnado de 4.º de ESO de Mérida y el objetivo, de «los jóvenes españoles».</li>
  <li><strong>Objetivos de intervención</strong> en un trabajo de investigación.</li>
  <li><strong>Objetivos específicos que no suman</strong> al general, o que introducen temas nuevos.</li>
  <li><strong>Pregunta causal con diseño descriptivo</strong>: se quiere saber el «efecto» pero solo se pasa un cuestionario una vez.</li>
  <li><strong>Hipótesis en un estudio cualitativo o exploratorio</strong>, o hipótesis con variables que no se van a medir.</li>
  <li><strong>Exceso de ambición</strong>: seis objetivos específicos y tres poblaciones en un trabajo de un curso.</li>
</ol>

<h3>Tres pruebas rápidas</h3>
<ul>
  <li>¿El objetivo general responde exactamente a la pregunta general, con la misma población y contexto?</li>
  <li>Si alcanzo todos los objetivos específicos, ¿he alcanzado el general?</li>
  <li>¿Cada variable de las hipótesis aparece en los objetivos y tiene previsto cómo se va a medir?</li>
</ul>`,
      examples: [
        {
          title: 'Ejemplo guiado: matriz de consistencia completa',
          body: `
<table>
  <tbody>
    <tr><th>Problema</th><td>Los talleres de competencia digital de los centros de mayores de una ciudad registran abandonos, pero sus evaluaciones solo recogen la satisfacción de quienes terminan; se desconocen los motivos de quienes abandonan.</td></tr>
    <tr><th>Pregunta</th><td>¿Qué motivos atribuyen al abandono las personas mayores que dejaron los talleres de competencia digital de los centros de mayores de la ciudad entre 2025 y 2027?</td></tr>
    <tr><th>Tipo</th><td>Comprensiva (enfoque cualitativo).</td></tr>
    <tr><th>Objetivo general</th><td>Comprender los motivos que las personas mayores atribuyen al abandono de los talleres de competencia digital de los centros de mayores de la ciudad entre 2025 y 2027.</td></tr>
    <tr><th>Objetivos específicos</th><td>1) Describir las expectativas con que se inscribieron. 2) Identificar las dificultades que encontraron durante el taller. 3) Analizar cómo valoran la adecuación del taller a sus necesidades cotidianas.</td></tr>
    <tr><th>Hipótesis</th><td>No se formulan: estudio cualitativo de carácter comprensivo.</td></tr>
    <tr><th>Categorías iniciales</th><td>Expectativas, dificultades (técnicas, de horario, de salud, relacionales), adecuación percibida.</td></tr>
    <tr><th>Método previsto</th><td>Entrevistas semiestructuradas a personas que abandonaron, con consentimiento informado; análisis temático.</td></tr>
  </tbody>
</table>
<p>Comprueba las tres pruebas: misma población y periodo en todos los niveles; los tres específicos componen el general; no hay hipótesis porque el enfoque no las requiere.</p>`,
        },
      ],
      recall: {
        prompt: 'Escribe de memoria el orden de la cadena de coherencia, tres errores de coherencia frecuentes y las tres pruebas rápidas para comprobar un planteamiento.',
        model: 'Problema → pregunta → objetivo general → preguntas y objetivos específicos → hipótesis si proceden → variables o categorías → método. Errores: cambiar de población, objetivos de intervención, específicos que no suman, pregunta causal con diseño descriptivo, hipótesis en estudios que no las requieren, exceso de ambición. Pruebas: el objetivo responde a la pregunta con la misma población; los específicos suman el general; cada variable de las hipótesis aparece en los objetivos y se va a medir.',
        checklist: [
          { concept: 'coherencia', text: 'He escrito la cadena completa en el orden correcto.' },
          { concept: 'coherencia', text: 'He recordado al menos tres errores frecuentes.' },
          { concept: 'objetivos-especificos', text: 'He incluido la prueba «los específicos suman el general».' },
        ],
      },
    },
  ],

  exercises: [
    {
      id: 'e1',
      type: 'classify',
      title: '¿Es una pregunta investigable?',
      minutes: 15,
      concepts: ['pregunta-investigable', 'delimitacion'],
      instructions: 'Clasifica cada pregunta. Si fallas, lee la explicación y vuelve a intentarlo antes de ver la respuesta.',
      options: [
        { id: 'si', label: 'Investigable' },
        { id: 'normativa', label: 'No: normativa o valorativa' },
        { id: 'amplia', label: 'No: demasiado amplia o vaga' },
        { id: 'no-empirica', label: 'No: no se puede responder con datos' },
      ],
      items: [
        { id: 'i1', text: '¿Debería prohibirse el uso del móvil en los institutos?', answer: 'normativa', concept: 'pregunta-investigable', why: '«¿Debería…?» pide un juicio de valor. Los datos pueden informar esa decisión, pero no responderla. Versión investigable: «¿Qué relación existe entre las normas de uso del móvil de los institutos de X y…?».' },
        { id: 'i2', text: '¿Qué relación existe entre la frecuencia con que las familias consultan la plataforma educativa del centro y la asistencia a clase del alumnado de 1.º de ESO de los institutos públicos de Cáceres durante el curso 2027/28?', answer: 'si', concept: 'delimitacion', why: 'Es empírica, neutral y está delimitada: quién (alumnado de 1.º de ESO y sus familias), qué (frecuencia de consulta y asistencia), dónde (institutos públicos de Cáceres) y cuándo (curso 2027/28). Es relacional.' },
        { id: 'i3', text: '¿Cómo afecta la tecnología a la educación?', answer: 'amplia', concept: 'delimitacion', why: 'No especifica qué tecnología, qué aspecto de la educación, qué población ni qué contexto. Es un tema, no una pregunta.' },
        { id: 'i4', text: '¿Cómo interpretan los educadores y educadoras sociales de los centros de protección de menores de Extremadura su papel en las decisiones sobre el itinerario educativo de los adolescentes que acompañan?', answer: 'si', concept: 'pregunta-investigable', why: 'Es una pregunta comprensiva, propia del enfoque cualitativo. Es empírica (se responde con entrevistas, por ejemplo), está delimitada y no presupone la respuesta.' },
        { id: 'i5', text: '¿Es la educación social la profesión más importante para la inclusión?', answer: 'normativa', concept: 'pregunta-investigable', why: '«La más importante» es una valoración. Podría investigarse cómo perciben distintos agentes la contribución de la educación social, pero no cuál «es» la más importante.' },
        { id: 'i6', text: '¿Tienen las instituciones educativas un alma colectiva?', answer: 'no-empirica', concept: 'pregunta-investigable', why: '«Alma colectiva» no es un concepto que pueda definirse de forma observable. Es una cuestión metafísica, no empírica.' },
        { id: 'i7', text: '¿Difiere la competencia digital docente autopercibida entre el profesorado de primaria de centros rurales y urbanos de la provincia de Badajoz en el curso 2027/28?', answer: 'si', concept: 'delimitacion', why: 'Comparativa, delimitada y neutral (no dice qué grupo puntuará más). El concepto central se puede medir con un cuestionario validado.' },
        { id: 'i8', text: '¿Qué piensan los jóvenes?', answer: 'amplia', concept: 'delimitacion', why: 'No dice qué jóvenes, sobre qué, dónde ni cuándo. Imposible decidir a quién preguntar ni qué preguntar.' },
      ],
    },
    {
      id: 'e2',
      type: 'classify',
      title: '¿Objetivo de investigación o de intervención?',
      minutes: 10,
      concepts: ['investigacion-vs-intervencion', 'verbos-objetivos'],
      instructions: 'Decide si cada enunciado es un objetivo de investigación (producir conocimiento) o de intervención (cambiar la realidad).',
      options: [
        { id: 'investigacion', label: 'Investigación' },
        { id: 'intervencion', label: 'Intervención' },
      ],
      items: [
        { id: 'i1', text: 'Reducir un 20 % el absentismo escolar del alumnado del barrio.', answer: 'intervencion', concept: 'investigacion-vs-intervencion', why: '«Reducir» expresa un cambio que se quiere provocar. Es una meta de un proyecto de intervención.' },
        { id: 'i2', text: 'Analizar los factores que el alumnado y sus familias asocian al absentismo escolar en el barrio.', answer: 'investigacion', concept: 'investigacion-vs-intervencion', why: '«Analizar» busca conocimiento sobre la situación, sin pretender modificarla.' },
        { id: 'i3', text: 'Formar al profesorado en metodologías inclusivas.', answer: 'intervencion', concept: 'verbos-objetivos', why: '«Formar» es una acción sobre la realidad. Investigar sería, por ejemplo, «Describir las necesidades formativas del profesorado en metodologías inclusivas».' },
        { id: 'i4', text: 'Describir el nivel de competencia digital de las personas usuarias de los centros de mayores de Cáceres.', answer: 'investigacion', concept: 'verbos-objetivos', why: '«Describir» es un verbo cognitivo y el enunciado mantiene población y contexto.' },
        { id: 'i5', text: 'Sensibilizar a la comunidad educativa sobre la violencia de género.', answer: 'intervencion', concept: 'verbos-objetivos', why: '«Sensibilizar» pretende cambiar actitudes: es intervención.' },
        { id: 'i6', text: 'Evaluar el efecto de un programa de mentoría sobre la permanencia escolar del alumnado participante.', answer: 'investigacion', concept: 'investigacion-vs-intervencion', why: 'Trampa habitual: aunque hay un programa, el objetivo es saber si funciona, no aplicarlo. Es investigación evaluativa.' },
        { id: 'i7', text: 'Comparar la soledad no deseada percibida entre personas mayores que participan y que no participan en un programa de acompañamiento.', answer: 'investigacion', concept: 'investigacion-vs-intervencion', why: '«Comparar» produce conocimiento sobre dos grupos. No pretende reducir la soledad, sino conocerla.' },
      ],
    },
    {
      id: 'e3',
      type: 'classify',
      title: 'Tipos de hipótesis',
      minutes: 10,
      concepts: ['tipos-hipotesis', 'falsabilidad'],
      instructions: 'Clasifica cada enunciado según el tipo de hipótesis.',
      options: [
        { id: 'direccional', label: 'De investigación direccional' },
        { id: 'no-direccional', label: 'De investigación no direccional' },
        { id: 'nula', label: 'Nula (H0)' },
        { id: 'no-contrastable', label: 'No es contrastable' },
      ],
      items: [
        { id: 'i1', text: 'El alumnado que participa en el programa de tutoría entre iguales obtiene mayor puntuación en autoestima que el que no participa.', answer: 'direccional', concept: 'tipos-hipotesis', why: '«Mayor puntuación» indica el sentido de la diferencia.' },
        { id: 'i2', text: 'Existen diferencias en la competencia digital autopercibida entre el profesorado rural y el urbano.', answer: 'no-direccional', concept: 'tipos-hipotesis', why: 'Afirma que hay diferencias, pero no dice qué grupo puntúa más.' },
        { id: 'i3', text: 'No existe relación entre las horas diarias de uso de redes sociales y la calificación en Lengua del alumnado de 2.º de ESO.', answer: 'nula', concept: 'tipos-hipotesis', why: 'Niega la relación: es la hipótesis que se somete a contraste estadístico.' },
        { id: 'i4', text: 'La educación social mejora la sociedad.', answer: 'no-contrastable', concept: 'falsabilidad', why: 'Ni «mejorar» ni «la sociedad» están definidos de forma observable: no hay dato que pudiera refutarla.' },
        { id: 'i5', text: 'A mayor apoyo familiar percibido, menor intención de abandono escolar.', answer: 'direccional', concept: 'tipos-hipotesis', why: 'Indica el sentido de la relación (inversa). Es una hipótesis correlacional direccional.' },
        { id: 'i6', text: 'Los jóvenes de hoy no tienen valores.', answer: 'no-contrastable', concept: 'falsabilidad', why: 'Es un juicio de valor general. «Tener valores» no está definido y la afirmación no se refiere a ninguna población concreta.' },
      ],
    },
    {
      id: 'e4',
      type: 'rewrite',
      title: 'Reformula una pregunta mal planteada',
      minutes: 20,
      concepts: ['pregunta-investigable', 'delimitacion', 'tipos-pregunta'],
      instructions: 'Reescribe la pregunta de partida para que sea investigable en un TFM. Escribe primero tu versión; la propuesta de referencia solo aparece después de que te autoevalúes.',
      start: '¿Cómo afecta la inteligencia artificial a la educación?',
      minChars: 80,
      checklist: [
        { concept: 'delimitacion', text: 'Indica la población (quién).' },
        { concept: 'delimitacion', text: 'Indica el contexto (dónde) y el periodo (cuándo).' },
        { concept: 'pregunta-investigable', text: 'Concreta qué uso de la IA y qué aspecto educativo, de forma observable.' },
        { concept: 'pregunta-investigable', text: 'Es neutral: no presupone que la IA mejora o empeora nada.' },
        { concept: 'tipos-pregunta', text: 'Sé decir de qué tipo es (descriptiva, relacional, comprensiva…).' },
      ],
      model: 'Una posible versión (hay muchas válidas): «¿Para qué tareas académicas declara utilizar herramientas de IA generativa el alumnado de 2.º de Bachillerato de los institutos públicos de Cáceres durante el curso 2027/28, y con qué frecuencia?». Es descriptiva y se respondería con un cuestionario. Otra, comprensiva: «¿Cómo describe el profesorado de Lengua de esos institutos los cambios en su forma de evaluar la escritura desde la aparición de la IA generativa?».',
    },
  ],

  quiz: [
    {
      id: 'q1',
      conceptId: 'tema-vs-problema',
      stem: '¿Cuál de estos enunciados es un problema de investigación y no un tema o una finalidad de intervención?',
      options: [
        { id: 'a', text: 'La brecha digital en las personas mayores.', feedback: 'Es un tema: un área de interés amplia. No indica qué se desconoce ni en qué contexto.' },
        { id: 'b', text: 'Aunque los centros de mayores de la ciudad ofrecen talleres digitales, se desconoce por qué una parte de las personas inscritas los abandona, lo que impide ajustar la oferta.', feedback: 'Contiene los tres componentes: situación en un contexto (talleres y abandono), vacío de conocimiento (no se conocen los motivos) y relevancia (ajustar la oferta).' },
        { id: 'c', text: 'Hay que conseguir que las personas mayores usen el teléfono móvil con autonomía.', feedback: 'Es una finalidad de intervención: expresa un cambio deseado en la realidad, no algo que no sepamos.' },
        { id: 'd', text: 'La tecnología y las personas mayores en el siglo XXI.', feedback: 'Parece un título, pero sigue siendo un tema: no contiene ningún vacío de conocimiento ni delimita contexto.' },
      ],
      correct: 'b',
    },
    {
      id: 'q2',
      conceptId: 'pregunta-investigable',
      stem: '¿Qué pregunta cumple mejor los requisitos de una pregunta investigable?',
      options: [
        { id: 'a', text: '¿Por qué el uso del móvil empeora el rendimiento escolar?', feedback: 'Presupone la respuesta: da por hecho que el móvil empeora el rendimiento. Una pregunta investigable debe ser neutral.' },
        { id: 'b', text: '¿Deberían los centros educativos enseñar a usar la IA?', feedback: 'Es normativa: «¿deberían…?» pide un juicio de valor, no algo que pueda responderse con datos.' },
        { id: 'c', text: '¿Qué relación existe entre la frecuencia de uso del aula virtual y las calificaciones de Matemáticas del alumnado de 4.º de ESO de dos institutos públicos de Cáceres en el curso 2027/28?', feedback: 'Es empírica, neutral, delimitada (quién, qué, dónde, cuándo) y de tipo relacional.' },
        { id: 'd', text: '¿Influye la tecnología en el aprendizaje?', feedback: 'Es demasiado amplia: no concreta qué tecnología, qué aprendizaje, qué población ni qué contexto, y se contesta con un sí o un no.' },
      ],
      correct: 'c',
    },
    {
      id: 'q3',
      conceptId: 'tipos-pregunta',
      stem: '«¿Cómo viven las familias monoparentales de un barrio su relación con el centro escolar de sus hijos e hijas?» ¿De qué tipo es esta pregunta?',
      options: [
        { id: 'a', text: 'Descriptiva cuantitativa.', feedback: 'No pide cifras ni frecuencias. «¿Cómo viven…?» busca significados y experiencias, no medir un nivel.' },
        { id: 'b', text: 'Causal o explicativa.', feedback: 'No pregunta por el efecto de una variable sobre otra. No hay variable independiente ni dependiente.' },
        { id: 'c', text: 'Comprensiva o interpretativa.', feedback: 'Pregunta por la experiencia vivida y su significado, lo que anticipa un enfoque cualitativo (entrevistas, grupos de discusión).' },
        { id: 'd', text: 'Correlacional.', feedback: 'No relaciona dos variables. Para ser correlacional tendría que preguntar, por ejemplo, por la relación entre la composición familiar y la participación.' },
      ],
      correct: 'c',
    },
    {
      id: 'q4',
      conceptId: 'investigacion-vs-intervencion',
      stem: 'En un trabajo de investigación sobre la participación de las familias en la escuela, ¿qué enunciado es un objetivo de investigación?',
      options: [
        { id: 'a', text: 'Fomentar la participación de las familias en las actividades del centro.', feedback: '«Fomentar» pretende cambiar la realidad: es un objetivo de intervención.' },
        { id: 'b', text: 'Identificar las barreras que perciben las familias para participar en las actividades del centro.', feedback: '«Identificar» busca conocimiento y el enunciado mantiene el fenómeno y la población.' },
        { id: 'c', text: 'Diseñar un cuestionario para las familias.', feedback: 'Es una actividad del método, no un conocimiento que se obtiene. Los instrumentos van en la metodología.' },
        { id: 'd', text: 'Sensibilizar al profesorado sobre la importancia de las familias.', feedback: '«Sensibilizar» es intervenir sobre actitudes, no investigar.' },
      ],
      correct: 'b',
    },
    {
      id: 'q5',
      conceptId: 'coherencia',
      stem: 'Pregunta: «¿Qué relación existe entre el apoyo familiar percibido y la intención de abandono escolar del alumnado de 4.º de ESO de Mérida?». ¿Qué objetivo general es coherente con ella?',
      options: [
        { id: 'a', text: 'Analizar la relación entre el apoyo familiar percibido y la intención de abandono escolar del alumnado de 4.º de ESO de Mérida.', feedback: 'Mantiene la relación, las variables y la población de la pregunta, con un verbo cognitivo adecuado.' },
        { id: 'b', text: 'Reducir el abandono escolar mediante un programa de apoyo a las familias.', feedback: 'Cambia de lógica: pasa de conocer a intervenir. Ya no responde a la pregunta.' },
        { id: 'c', text: 'Describir las causas del abandono escolar en España.', feedback: 'Cambia la población (de Mérida a España), el fenómeno (de intención a abandono) y el alcance (de relación a causas).' },
        { id: 'd', text: 'Demostrar que el apoyo familiar evita el abandono escolar.', feedback: '«Demostrar» presupone el resultado, y «evita» introduce una afirmación causal que una pregunta relacional no permite.' },
      ],
      correct: 'a',
    },
    {
      id: 'q6',
      conceptId: 'cuando-hipotesis',
      stem: '¿En cuál de estos estudios es menos adecuado formular una hipótesis de antemano?',
      options: [
        { id: 'a', text: 'Un estudio que compara la autoestima del alumnado que participa y que no participa en un programa de tutoría.', feedback: 'Es un estudio comparativo cuantitativo: hay una diferencia que contrastar y la hipótesis es pertinente.' },
        { id: 'b', text: 'Un estudio exploratorio cualitativo sobre cómo viven las personas jóvenes migrantes no acompañadas su llegada a un recurso residencial.', feedback: 'Es exploratorio y cualitativo: no hay base suficiente para anticipar resultados y el enfoque busca comprender, no contrastar.' },
        { id: 'c', text: 'Un estudio que analiza la relación entre horas de sueño y rendimiento académico.', feedback: 'Es correlacional: se espera una relación entre variables, así que la hipótesis tiene sentido.' },
        { id: 'd', text: 'Un cuasiexperimento que evalúa el efecto de un programa de lectura en la comprensión lectora.', feedback: 'Es explicativo: la hipótesis sobre el efecto del programa es central en este diseño.' },
      ],
      correct: 'b',
    },
    {
      id: 'q7',
      conceptId: 'tipos-hipotesis',
      stem: '«No existen diferencias en la competencia digital autopercibida entre el profesorado de centros rurales y el de centros urbanos.» Este enunciado es:',
      options: [
        { id: 'a', text: 'Una hipótesis de investigación direccional.', feedback: 'No indica que un grupo puntúe más que otro; de hecho, niega la diferencia.' },
        { id: 'b', text: 'Una hipótesis alternativa.', feedback: 'La alternativa afirmaría que sí hay diferencias. Esta las niega.' },
        { id: 'c', text: 'Una hipótesis nula.', feedback: 'Niega la diferencia entre grupos. Es la que se somete a contraste: si los datos permiten rechazarla, se acepta la alternativa.' },
        { id: 'd', text: 'Un enunciado no contrastable.', feedback: 'Sí es contrastable: las variables (tipo de centro y puntuación en competencia digital) se pueden observar y medir.' },
      ],
      correct: 'c',
    },
    {
      id: 'q8',
      conceptId: 'variables',
      stem: 'Hipótesis: «El alumnado de 4.º de ESO que usa el aula virtual al menos tres veces por semana obtiene mejores calificaciones en Matemáticas que el que la usa con menos frecuencia». ¿Cuál es la variable dependiente?',
      options: [
        { id: 'a', text: 'La frecuencia de uso del aula virtual.', feedback: 'Es la variable independiente: el factor que se supone que influye.' },
        { id: 'b', text: 'Las calificaciones en Matemáticas.', feedback: 'Es el resultado que se mide para ver si varía según la frecuencia de uso.' },
        { id: 'c', text: 'El curso (4.º de ESO).', feedback: 'Es una característica que delimita la población, no una variable del estudio: todos los participantes comparten ese valor.' },
        { id: 'd', text: 'El aula virtual.', feedback: 'Es el recurso, no una variable. La variable es cuánto se usa (independiente).' },
      ],
      correct: 'b',
    },
  ],

  reflection: {
    prompt: 'Piensa en un proyecto de intervención social o educativa en el que hayas participado.',
    guide: [
      '¿Qué decisión tomasteis sin tener datos suficientes? ¿Qué no sabíais?',
      'Formula ese desconocimiento como problema de investigación (situación, vacío, relevancia).',
      '¿Qué cambia en tu forma de redactar objetivos cuando pasas de intervenir a investigar?',
      '¿En qué fases de este planteamiento te ayudaría una herramienta de IA y en cuáles debes decidir tú? Justifícalo.',
    ],
    minChars: 200,
  },

  activity: {
    id: 'a1',
    title: 'Matriz de consistencia de tu anteproyecto',
    minutes: 60,
    description: 'Elabora un primer planteamiento de investigación sobre un tema de tu ámbito profesional. No tiene que ser definitivo: es un borrador que irás mejorando y que podrás llevar a una primera tutoría.',
    fields: [
      { id: 'tema', label: 'Tema', rows: 1 },
      { id: 'problema', label: 'Problema (situación, vacío de conocimiento y relevancia)', rows: 5 },
      { id: 'pregunta', label: 'Pregunta general', rows: 2 },
      { id: 'tipo', label: 'Tipo de pregunta y enfoque previsto', rows: 1 },
      { id: 'og', label: 'Objetivo general', rows: 2 },
      { id: 'oe', label: 'Objetivos específicos (3 o 4)', rows: 4 },
      { id: 'hipotesis', label: 'Hipótesis, o justificación de por qué no proceden', rows: 3 },
      { id: 'variables', label: 'Variables o categorías iniciales', rows: 2 },
      { id: 'fuentes', label: 'Fuentes consultadas para justificar el vacío (al menos dos, de la biblioteca o propias)', rows: 3 },
    ],
    rubric: [
      { id: 'r1', text: 'El problema contiene situación, vacío de conocimiento y relevancia.' },
      { id: 'r2', text: 'La pregunta es empírica, neutral y está delimitada (quién, qué, dónde, cuándo).' },
      { id: 'r3', text: 'El objetivo general responde a la pregunta con la misma población y contexto.' },
      { id: 'r4', text: 'Si alcanzo todos los específicos, alcanzo el general; ninguno es una actividad.' },
      { id: 'r5', text: 'No hay verbos de intervención ni verbos que presupongan el resultado.' },
      { id: 'r6', text: 'La decisión sobre las hipótesis es coherente con el tipo de estudio.' },
      { id: 'r7', text: 'Las variables o categorías se corresponden con los objetivos.' },
      { id: 'r8', text: 'He consultado fuentes reales para afirmar que existe un vacío de conocimiento.' },
    ],
  },

  references: ['hernandez-mendoza-2018', 'hernandez-2014', 'creswell-2018', 'bisquerra-2004', 'mcmillan-2005', 'cohen-2018', 'corbetta-2007', 'hulley-2013', 'popper-1980', 'apa-2020'],
};
