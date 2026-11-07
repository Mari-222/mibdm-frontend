import { api } from '../api.js';
import { esc, montar, vacio } from '../ui.js';

export async function vistaArtista(el, usuario, id) {
  if (!id) {
    location.hash = '#/explorar';
    return;
  }
  const { artista, albumes } = await api.artista(id);

  montar(el, `
    <p><a href="#/explorar">← Explorar</a></p>
    <div class="panel">
      <h2>${esc(artista.nombre)}</h2>
      <p class="suave">${esc(artista.tipo)}${artista.paisOrigen ? ' · ' + esc(artista.paisOrigen) : ''}</p>
    </div>
    <h3>Álbumes</h3>
    ${albumes.length === 0 ? vacio('Este artista no tiene álbumes registrados.') : `
      <div class="tabla-scroll"><table>
        <tr><th>Título</th><th>Año</th><th>Tipo</th><th>Canciones</th></tr>
        ${albumes.map((a) => `<tr>
          <td><a href="#/album/${a.idAlbum}">${esc(a.titulo)}</a></td>
          <td>${a.anioLanzamiento}</td><td>${esc(a.tipo)}</td><td>${a.numCanciones}</td></tr>`).join('')}
      </table></div>`}`);
}
