import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addCard, setQty, removeCard, updatePrice, totalValue, totalCards, recordSnapshot, parseImport,
} from '../js/collection.js';

const pika = { id: 'pokemon:base1-58', game: 'pokemon', name: 'Pikachu', price: 2.5 };
const bolt = { id: 'mtg:abc', game: 'mtg', name: 'Lightning Bolt', price: 1 };

test('añadir dos veces la misma carta suma cantidad', () => {
  const col = addCard(addCard([], pika), pika);
  assert.equal(col.length, 1);
  assert.equal(col[0].qty, 2);
});

test('valor y número de cartas', () => {
  let col = addCard(addCard(addCard([], pika), pika), bolt);
  assert.equal(totalValue(col), 6);
  assert.equal(totalCards(col), 3);
  col = updatePrice(col, bolt.id, null);
  assert.equal(totalValue(col), 5);
});

test('cantidad 0 elimina la carta', () => {
  const col = setQty(addCard([], pika), pika.id, 0);
  assert.deepEqual(col, []);
  assert.deepEqual(removeCard(addCard([], bolt), bolt.id), []);
});

test('un punto de historial por día, ordenado', () => {
  let h = recordSnapshot([], 10, new Date('2026-10-25T10:00:00Z'));
  h = recordSnapshot(h, 12, new Date('2026-10-25T20:00:00Z'));
  h = recordSnapshot(h, 8, new Date('2026-10-24T20:00:00Z'));
  assert.deepEqual(h, [{ day: '2026-10-24', value: 8 }, { day: '2026-10-25', value: 12 }]);
});

test('importar acepta el formato exportado y descarta basura', () => {
  const text = JSON.stringify({ collection: [{ ...pika, qty: 3 }, { foo: 1 }, { ...bolt, qty: -2 }] });
  const cards = parseImport(text);
  assert.equal(cards.length, 2);
  assert.equal(cards[0].qty, 3);
  assert.equal(cards[1].qty, 1);
  assert.throws(() => parseImport('{"a":1}'));
});
