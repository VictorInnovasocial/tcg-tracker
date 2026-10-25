import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeScryfall, normalizePokemon, pokemonQuery, amazonUrl } from '../js/api.js';

test('normaliza una carta de Scryfall de doble cara', () => {
  const card = normalizeScryfall({
    id: 'x1', name: 'Delver of Secrets // Insectile Aberration', set_name: 'Innistrad', collector_number: '51',
    card_faces: [{ image_uris: { normal: 'https://img/n.jpg' } }],
    prices: { eur: null, eur_foil: '3.10' },
    purchase_uris: { cardmarket: 'https://www.cardmarket.com/x' },
  });
  assert.equal(card.id, 'mtg:x1');
  assert.equal(card.image, 'https://img/n.jpg');
  assert.equal(card.price, 3.1);
  assert.equal(card.buyUrl, 'https://www.cardmarket.com/x');
});

test('normaliza una carta de Pokémon con precio de Cardmarket', () => {
  const card = normalizePokemon({
    id: 'base1-4', name: 'Charizard', number: '4', set: { name: 'Base' },
    images: { small: 'https://img/s.png' },
    cardmarket: { url: 'https://prices.pokemontcg.io/cardmarket/base1-4', prices: { trendPrice: 350.5 } },
  });
  assert.equal(card.id, 'pokemon:base1-4');
  assert.equal(card.price, 350.5);
  assert.equal(card.set, 'Base');
});

test('carta sin precio devuelve null', () => {
  assert.equal(normalizePokemon({ id: 'a', name: 'A' }).price, null);
});

test('consulta de Pokémon: comodín para una palabra, frase para varias', () => {
  assert.equal(pokemonQuery('charizard'), 'name:charizard*');
  assert.equal(pokemonQuery('mew "ex"'), 'name:"mew ex"');
});

test('enlace de Amazon con búsqueda', () => {
  const url = new URL(amazonUrl({ name: 'Pikachu', game: 'pokemon' }));
  assert.equal(url.hostname, 'www.amazon.es');
  assert.equal(url.searchParams.get('k'), 'Pikachu pokemon tcg');
});
