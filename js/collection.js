// Lógica de la colección. Funciones puras: reciben un array y devuelven uno nuevo.

export function addCard(collection, card) {
  const existing = collection.find((c) => c.id === card.id);
  if (existing) return setQty(collection, card.id, existing.qty + 1);
  return [...collection, { ...card, qty: 1, addedAt: new Date().toISOString() }];
}

export function setQty(collection, id, qty) {
  if (qty <= 0) return removeCard(collection, id);
  return collection.map((c) => (c.id === id ? { ...c, qty } : c));
}

export function removeCard(collection, id) {
  return collection.filter((c) => c.id !== id);
}

export function updatePrice(collection, id, price) {
  return collection.map((c) =>
    c.id === id ? { ...c, price, priceUpdatedAt: new Date().toISOString() } : c,
  );
}

export function totalValue(collection) {
  return collection.reduce((sum, c) => sum + (Number(c.price) || 0) * c.qty, 0);
}

export function totalCards(collection) {
  return collection.reduce((sum, c) => sum + c.qty, 0);
}

// Guarda un punto por día con el valor total; conserva el último año.
export function recordSnapshot(history, value, date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  const rounded = Math.round(value * 100) / 100;
  const rest = history.filter((h) => h.day !== day);
  return [...rest, { day, value: rounded }].sort((a, b) => a.day.localeCompare(b.day)).slice(-365);
}

export function parseImport(text) {
  const data = JSON.parse(text);
  const cards = Array.isArray(data) ? data : data.collection;
  if (!Array.isArray(cards)) throw new Error('El archivo no contiene una colección.');
  return cards
    .filter((c) => c && typeof c.id === 'string' && typeof c.name === 'string')
    .map((c) => ({ ...c, qty: Math.max(1, Math.floor(Number(c.qty) || 1)) }));
}
