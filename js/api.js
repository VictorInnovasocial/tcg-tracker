// Fuentes de precios: Scryfall (Magic) y Pokémon TCG API. Ambas son gratuitas, permiten
// peticiones desde el navegador y devuelven precios de Cardmarket en euros.
import { CONFIG } from './config.js';

const SCRYFALL = 'https://api.scryfall.com';
const POKEMON = 'https://api.pokemontcg.io/v2';

export const GAMES = {
  pokemon: 'Pokémon',
  mtg: 'Magic: The Gathering',
};

function withReferrer(url) {
  if (!url || !CONFIG.cardmarketReferrer) return url || '';
  try {
    const u = new URL(url);
    u.searchParams.set('referrer', CONFIG.cardmarketReferrer);
    return u.toString();
  } catch {
    return url;
  }
}

function toNumber(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

export function normalizeScryfall(card) {
  const face = card.card_faces?.[0];
  const images = card.image_uris || face?.image_uris || {};
  return {
    id: `mtg:${card.id}`,
    game: 'mtg',
    name: card.name,
    set: card.set_name || '',
    number: card.collector_number || '',
    image: images.normal || images.small || '',
    price: toNumber(card.prices?.eur) ?? toNumber(card.prices?.eur_foil),
    buyUrl: withReferrer(card.purchase_uris?.cardmarket),
  };
}

export function normalizePokemon(card) {
  const p = card.cardmarket?.prices || {};
  return {
    id: `pokemon:${card.id}`,
    game: 'pokemon',
    name: card.name,
    set: card.set?.name || '',
    number: card.number || '',
    image: card.images?.small || card.images?.large || '',
    price: toNumber(p.trendPrice) ?? toNumber(p.averageSellPrice) ?? toNumber(p.avg30),
    buyUrl: withReferrer(card.cardmarket?.url),
  };
}

// Construye la consulta de búsqueda de la Pokémon TCG API.
export function pokemonQuery(text) {
  const clean = text.replace(/["\\*]/g, '').trim();
  return clean.includes(' ') ? `name:"${clean}"` : `name:${clean}*`;
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`El servicio de precios respondió ${res.status}. Prueba de nuevo en un minuto.`);
  return res.json();
}

export async function searchCards(game, text) {
  if (!text.trim()) return [];
  if (game === 'mtg') {
    const data = await getJson(`${SCRYFALL}/cards/search?unique=prints&q=${encodeURIComponent(text)}`);
    return (data?.data || []).slice(0, 36).map(normalizeScryfall);
  }
  const q = encodeURIComponent(pokemonQuery(text));
  const data = await getJson(`${POKEMON}/cards?q=${q}&pageSize=36&orderBy=-set.releaseDate`);
  return (data?.data || []).map(normalizePokemon);
}

export async function fetchCard(id) {
  const [game, rawId] = id.split(/:(.*)/s);
  if (game === 'mtg') {
    const data = await getJson(`${SCRYFALL}/cards/${encodeURIComponent(rawId)}`);
    return data ? normalizeScryfall(data) : null;
  }
  const data = await getJson(`${POKEMON}/cards/${encodeURIComponent(rawId)}`);
  return data?.data ? normalizePokemon(data.data) : null;
}

export function amazonUrl(card) {
  const query = `${card.name} ${card.game === 'mtg' ? 'magic' : 'pokemon'} tcg`;
  const u = new URL('https://www.amazon.es/s');
  u.searchParams.set('k', query);
  if (CONFIG.amazonTag) u.searchParams.set('tag', CONFIG.amazonTag);
  return u.toString();
}
