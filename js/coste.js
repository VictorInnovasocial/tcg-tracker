import { DEFAULTS, hoursBetween, opportunityCost, costOfWaiting } from './finance.js';

const KEY = 'coste.params';
const FIELDS = ['capital', 'monthly', 'annualReturn', 'cashYield', 'inflation', 'projectMonthly'];

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const eurFine = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 4, maximumFractionDigits: 4 });
const eurRound = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const $ = (id) => document.getElementById(id);

function loadParams() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { ...DEFAULTS }; }
}
function saveParams(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* almacenamiento no disponible */ }
}

// Convierte un ISO a lo que espera <input type="datetime-local"> en hora local.
function toLocalInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

let params = loadParams();

function fillForm() {
  for (const f of FIELDS) $(f).value = params[f];
  $('start').value = toLocalInput(params.start);
}

function readForm() {
  const next = { ...params };
  for (const f of FIELDS) {
    const n = parseFloat($(f).value);
    next[f] = Number.isFinite(n) ? n : 0;
  }
  const start = new Date($('start').value);
  if (!Number.isNaN(start.getTime())) next.start = start.toISOString();
  return next;
}

function formatHours(h) {
  const total = Math.floor(h * 60);
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const mins = total % 60;
  return days > 0 ? `${days} d ${hours} h ${mins} min` : `${hours} h ${mins} min`;
}

function tick() {
  const hours = hoursBetween(params.start);
  const cost = opportunityCost(params, hours);
  $('counter').textContent = eurFine.format(cost.total);
  $('elapsed').textContent = formatHours(hours);
  $('since').textContent = new Date(params.start).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
  $('c-invest').textContent = eurFine.format(cost.invest);
  $('c-inflation').textContent = eurFine.format(cost.inflation);
  $('c-project').textContent = eurFine.format(cost.project);
  const perDay = opportunityCost(params, 24).total;
  $('per-day').textContent = eur.format(perDay);
  $('per-year').textContent = eurRound.format(opportunityCost(params, 24 * 365.25).total);
}

function renderWaiting() {
  const rows = [5, 10, 20, 30].map((years) => {
    const { now, later, diff } = costOfWaiting(params.capital, params.monthly, params.annualReturn, years, 1);
    const tr = document.createElement('tr');
    for (const [text, cls] of [[`${years} años`, ''], [eurRound.format(now), 'num'], [eurRound.format(later), 'num'], [`−${eurRound.format(diff)}`, 'num loss']]) {
      const td = document.createElement('td');
      td.textContent = text;
      if (cls) td.className = cls;
      tr.append(td);
    }
    return tr;
  });
  $('waiting-body').replaceChildren(...rows);
}

$('params').addEventListener('input', () => {
  params = readForm();
  saveParams(params);
  renderWaiting();
  tick();
});
$('reset').addEventListener('click', () => {
  params = { ...DEFAULTS };
  saveParams(params);
  fillForm();
  renderWaiting();
  tick();
});

fillForm();
renderWaiting();
tick();
setInterval(tick, 250);
