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

/** true si la página se ve incrustada (p. ej., como Artifact), donde las descargas no funcionan. */
export const inFrame = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

/**
 * Confirmación dentro de la página (los diálogos nativos no funcionan en todos los visores).
 * Con `requireText`, el botón solo se activa al escribir ese texto exacto.
 */
export function ask(message, { confirmLabel = 'Confirmar', danger = false, requireText = null } = {}) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const wrap = document.createElement('div');
    wrap.className = 'modal-back';
    wrap.innerHTML = `<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="ask-msg">
      <p id="ask-msg">${esc(message)}</p>
      ${requireText ? `<label for="ask-input">Escribe <strong>${esc(requireText)}</strong> para confirmar<input id="ask-input" autocomplete="off"></label>` : ''}
      <div class="row"><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-ok ${requireText ? 'disabled' : ''}>${esc(confirmLabel)}</button><button class="btn" data-cancel>Cancelar</button></div>
    </div>`;
    const close = (v) => {
      wrap.remove();
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
      resolve(v);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close(false);
    };
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap || e.target.closest('[data-cancel]')) close(false);
      if (e.target.closest('[data-ok]')) close(true);
    });
    wrap.querySelector('#ask-input')?.addEventListener('input', (e) => {
      wrap.querySelector('[data-ok]').disabled = e.target.value.trim() !== requireText;
    });
    document.addEventListener('keydown', onKey);
    document.body.append(wrap);
    (wrap.querySelector('#ask-input') ?? wrap.querySelector('[data-cancel]')).focus();
  });
}

/** Copia texto al portapapeles; si el navegador lo impide, selecciona el texto del elemento indicado. */
export async function copyText(text, fallbackEl) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (fallbackEl) {
      fallbackEl.focus();
      fallbackEl.select?.();
    }
    return false;
  }
}
