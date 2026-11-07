import { api } from '../api.js';
import { esc, fmtTiempoTotal, montar } from '../ui.js';

function barras(titulo, items) {
  const max = Math.max(1, ...items.map((i) => i.total));
  return `<div class="panel">
    <h3 style="margin-top:0">${titulo}</h3>
    ${items.length === 0 ? '<p class="suave">Sin datos todavía.</p>' : items.map((i) => `
      <div class="barra-dato">
        <div class="linea"><span>${esc(i.nombre)}</span><strong>${i.total}</strong></div>
        <div class="pista"><div class="relleno" style="width:${(i.total / max) * 100}%"></div></div>
      </div>`).join('')}
  </div>`;
}

export async function vistaEstadisticas(el, usuario) {
  const s = await api.estadisticas(usuario.idUsuario);

  montar(el, `
    <h2>Mis estadísticas</h2>
    <div class="stats">
      <div class="stat"><div class="suave">Escuchas registradas</div><div class="valor">${s.totalEscuchas}</div></div>
      <div class="stat"><div class="suave">Tiempo escuchado</div><div class="valor">${fmtTiempoTotal(s.totalSegundos)}</div></div>
    </div>
    <div class="grid-2">
      ${barras('Canciones más escuchadas', s.topCanciones)}
      ${barras('Álbumes más escuchados', s.topAlbumes)}
      ${barras('Artistas más escuchados', s.topArtistas)}
      ${barras('Géneros más escuchados', s.topGeneros)}
      ${barras('Escuchas por plataforma', s.porPlataforma)}
    </div>`);
}
