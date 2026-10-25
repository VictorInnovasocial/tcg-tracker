// Cálculos del coste de oportunidad. Funciones puras, sin DOM, para poder testearlas.

export const HOURS_PER_YEAR = 24 * 365.25;
export const HOURS_PER_MONTH = HOURS_PER_YEAR / 12;

// Momento en que pediste esto (la noche del 25 de octubre de 2026, 02:10 hora peninsular).
export const DEFAULT_START = '2026-10-25T00:10:00Z';

export const DEFAULTS = Object.freeze({
  start: DEFAULT_START,
  capital: 5000, // € parados en la cuenta corriente (ejemplo: cámbialo por tu cifra)
  monthly: 200, // € que podrías aportar cada mes
  annualReturn: 7, // % anual esperado de un fondo indexado global (media histórica, no garantizada)
  cashYield: 0, // % que te da hoy la cuenta donde está el dinero
  inflation: 2.5, // % inflación anual estimada
  projectMonthly: 100, // € al mes que el proyecto podría generar cuando esté maduro (hipótesis)
});

export function hoursBetween(startIso, now = Date.now()) {
  const start = new Date(startIso).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, (now - start) / 3.6e6);
}

// Crecimiento compuesto de un capital durante `hours` horas a un tipo anual en %.
function grow(capital, ratePct, hours) {
  return capital * Math.pow(1 + ratePct / 100, hours / HOURS_PER_YEAR);
}

// Lo que habría ganado el capital invertido frente a dejarlo donde está.
export function forgoneReturn({ capital, annualReturn, cashYield }, hours) {
  return grow(capital, annualReturn, hours) - grow(capital, cashYield, hours);
}

// Poder adquisitivo que pierde el dinero parado por la inflación.
export function inflationLoss({ capital, cashYield, inflation }, hours) {
  const real = Math.pow((1 + cashYield / 100) / (1 + inflation / 100), hours / HOURS_PER_YEAR);
  return capital * (1 - real);
}

// Retrasar un proyecto desplaza toda su curva de ingresos: cuando esté maduro,
// cada hora de retraso equivale a una hora menos de ingresos.
export function projectDelayCost({ projectMonthly }, hours) {
  return (projectMonthly * hours) / HOURS_PER_MONTH;
}

export function opportunityCost(params, hours) {
  const invest = forgoneReturn(params, hours);
  const inflation = inflationLoss(params, hours);
  const project = projectDelayCost(params, hours);
  return { invest, inflation, project, total: invest + inflation + project };
}

// Valor futuro de un capital inicial más aportaciones mensuales (al final de cada mes).
export function futureValue(capital, monthly, annualReturnPct, years) {
  const months = Math.round(years * 12);
  if (months <= 0) return capital;
  const m = Math.pow(1 + annualReturnPct / 100, 1 / 12) - 1;
  if (m === 0) return capital + monthly * months;
  const g = Math.pow(1 + m, months);
  return capital * g + monthly * ((g - 1) / m);
}

// Cuánto menos tendrías a `years` vista si empiezas con `delayYears` de retraso.
// Durante el retraso el capital no crece pero las aportaciones se acumulan sin invertir.
export function costOfWaiting(capital, monthly, annualReturnPct, years, delayYears = 1) {
  const now = futureValue(capital, monthly, annualReturnPct, years);
  const waitedCapital = capital + monthly * Math.round(delayYears * 12);
  const later = futureValue(waitedCapital, monthly, annualReturnPct, years - delayYears);
  return { now, later, diff: now - later };
}
