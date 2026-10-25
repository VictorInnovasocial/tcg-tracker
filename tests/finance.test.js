import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULTS, HOURS_PER_YEAR, hoursBetween, forgoneReturn, inflationLoss, projectDelayCost,
  opportunityCost, futureValue, costOfWaiting,
} from '../js/finance.js';

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test('hoursBetween cuenta horas y nunca es negativo', () => {
  const start = '2026-10-25T00:00:00Z';
  close(hoursBetween(start, Date.parse('2026-10-25T08:00:00Z')), 8);
  assert.equal(hoursBetween(start, Date.parse('2026-10-24T00:00:00Z')), 0);
  assert.equal(hoursBetween('no-es-fecha'), 0);
});

test('un año completo da la rentabilidad anual exacta', () => {
  const p = { capital: 10000, annualReturn: 7, cashYield: 0, inflation: 2.5 };
  close(forgoneReturn(p, HOURS_PER_YEAR), 700);
  close(inflationLoss(p, HOURS_PER_YEAR), 10000 * (1 - 1 / 1.025));
});

test('si la cuenta rinde lo mismo que la inversión no hay coste', () => {
  close(forgoneReturn({ capital: 5000, annualReturn: 3, cashYield: 3 }, 1000), 0);
});

test('el retraso del proyecto es proporcional a las horas', () => {
  close(projectDelayCost({ projectMonthly: 100 }, HOURS_PER_YEAR / 12), 100);
});

test('opportunityCost suma los tres componentes', () => {
  const c = opportunityCost(DEFAULTS, 8);
  close(c.total, c.invest + c.inflation + c.project);
  assert.ok(c.total > 0);
});

test('futureValue con tipo 0 es la suma de aportaciones', () => {
  close(futureValue(1000, 100, 0, 2), 1000 + 2400);
  close(futureValue(1000, 0, 7, 1), 1070);
});

test('esperar un año siempre cuesta dinero con rentabilidad positiva', () => {
  const { now, later, diff } = costOfWaiting(5000, 200, 7, 10, 1);
  assert.ok(now > later);
  close(diff, now - later);
});
