// Utilidades de presentacion compartidas por todas las vistas.

/** Escapa texto para insertarlo de forma segura en HTML. */
export function esc(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** 369 -> "6:09" */
export function fmtDuracion(segundos) {
  const m = Math.floor(segundos / 60);
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/** 5400 -> "1 h 30 min" */
export function fmtTiempoTotal(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

/** "2026-04-18T19:00:00" -> "18/4/2026 19:00" */
export function fmtFechaHora(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' });
}

/** "2026-04-18" -> "18/4/2026" (se evita new Date para no desplazar el dia por zona horaria) */
export function fmtFecha(iso) {
  const [a, m, d] = iso.split('-');
  return `${Number(d)}/${Number(m)}/${a}`;
}

export function estrellas(n) {
  const entero = Math.round(n);
  return '★'.repeat(entero) + '☆'.repeat(5 - entero);
}

export function promedioTexto(promedio, total) {
  if (!total) return '<span class="suave">Sin calificaciones</span>';
  return `<span class="estrellas">${estrellas(promedio)}</span> ${promedio.toFixed(1)} <span class="suave">(${total})</span>`;
}

let temporizador;
export function aviso(mensaje, esError = false) {
  const el = document.getElementById('toast');
  el.textContent = mensaje;
  el.className = 'toast' + (esError ? ' error' : '');
  el.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { el.hidden = true; }, esError ? 5000 : 2500);
}

/** Ejecuta una accion async y muestra el error (si lo hay) como aviso. */
export async function intentar(accion) {
  try {
    return await accion();
  } catch (e) {
    aviso(e.message, true);
    return undefined;
  }
}

/**
 * Reemplaza el contenido de `el` por `html` dentro de un div nuevo y lo devuelve.
 * Los eventos se registran sobre ese div, asi desaparecen cuando se cambia de vista.
 */
export function montar(el, html) {
  el.innerHTML = '<div>' + html + '</div>';
  return el.firstElementChild;
}

export function vacio(texto) {
  return `<div class="vacio">${esc(texto)}</div>`;
}
