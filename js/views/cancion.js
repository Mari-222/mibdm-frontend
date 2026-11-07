import { api } from '../api.js';
import { formEscucha, formCalificar } from '../components.js';
import { esc, fmtDuracion, montar, promedioTexto } from '../ui.js';

export async function vistaCancion(el, usuario, id) {
  if (!id) {
    location.hash = '#/explorar';
    return;
  }
  const [d, plataformas] = await Promise.all([api.cancion(id), api.plataformas()]);
  const c = d.cancion;

  const raiz = montar(el, `
    <p><a href="#/explorar">← Explorar</a></p>
    <div class="panel">
      <h2>${esc(c.titulo)}</h2>
      <p>${esc(c.artistas ?? '')}
        ${c.idAlbum ? `· <a href="#/album/${c.idAlbum}">${esc(c.album)}</a>` : '· <span class="suave">Sencillo</span>'}</p>
      <p class="suave">Duración ${fmtDuracion(c.duracionSeg)}${c.numeroPista ? ` · pista ${c.numeroPista}` : ''}</p>
      <p>${d.generos.map((g) => `<span class="etiqueta">${esc(g.nombre)}</span>`).join('')}</p>
      <p>${promedioTexto(d.promedio, d.totalCalificaciones)}</p>
      <h3>Participan</h3>
      <ul>${d.participantes.map((p) =>
        `<li><a href="#/artista/${p.idArtista}">${esc(p.nombre)}</a> <span class="suave">· ${esc(p.rol)}</span></li>`).join('')}</ul>
    </div>
    <div class="grid-2">
      <div class="panel" id="escucha"></div>
      <div class="panel" id="calif"></div>
    </div>`);

  formEscucha(raiz.querySelector('#escucha'), { usuario, plataformas, idCancion: id });
  await formCalificar(raiz.querySelector('#calif'), {
    usuario, tipo: 'cancion', id,
    onCambio: () => vistaCancion(el, usuario, id),
  });
}
