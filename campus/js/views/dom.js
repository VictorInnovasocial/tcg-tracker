// Utilidades de interfaz compartidas por las vistas.
export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const fmtDate = (d) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtDay = (day) => fmtDate(`${day}T12:00:00`);
export const fmtMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);

export function bar(pct, label = '') {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return `<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(label)}"><span style="width:${p}%"></span></div>`;
}

export const aiBadge = () => '<span class="badge badge-ai" title="Texto elaborado con IA a partir de manuales de metodología. No es el programa oficial.">Material de estudio IA</span>';
export const sourceBadge = () => '<span class="badge badge-source" title="Obra académica publicada">Fuente académica</span>';

/** Descarga un texto como archivo. */
export function download(filename, text, type = 'application/json') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
