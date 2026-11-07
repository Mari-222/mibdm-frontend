import { api } from '../api.js';
import { esc, fmtDuracion, montar, vacio, aviso } from '../ui.js';

export async function vistaExplorar(el) {
  const generos = await api.generos();
  let tab = 'canciones';

  const raiz = montar(el, `
    <h2>Explorar</h2>
    <div class="tabs">
      <button data-tab="canciones" class="activo">Canciones</button>
      <button data-tab="albumes">Álbumes</button>
      <button data-tab="artistas">Artistas</button>
    </div>
    <div class="fila" style="margin-bottom:14px">
      <div class="campo"><input id="q" type="search" placeholder="Buscar por nombre o título…" aria-label="Buscar"></div>
      <div class="campo" id="campo-genero">
        <select id="genero" aria-label="Género">
          <option value="">Todos los géneros</option>
          ${generos.map((g) => `<option value="${g.idGenero}">${esc(g.nombre)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div id="lista"></div>`);

  const lista = raiz.querySelector('#lista');
  const q = raiz.querySelector('#q');
  const genero = raiz.querySelector('#genero');

  async function cargar() {
    raiz.querySelector('#campo-genero').hidden = tab !== 'canciones';
    try {
      if (tab === 'canciones') {
        const items = await api.canciones(q.value, genero.value);
        lista.innerHTML = items.length === 0 ? vacio('No hay canciones que coincidan.') : `
          <div class="tabla-scroll"><table>
            <tr><th>Título</th><th>Artista</th><th>Álbum</th><th>Géneros</th><th>Duración</th></tr>
            ${items.map((c) => `<tr>
              <td><a href="#/cancion/${c.idCancion}">${esc(c.titulo)}</a></td>
              <td>${esc(c.artistas ?? '')}</td>
              <td>${c.idAlbum ? `<a href="#/album/${c.idAlbum}">${esc(c.album)}</a>` : '<span class="suave">Sencillo</span>'}</td>
              <td>${esc(c.generos ?? '')}</td>
              <td>${fmtDuracion(c.duracionSeg)}</td></tr>`).join('')}
          </table></div>`;
      } else if (tab === 'albumes') {
        const items = await api.albumes(q.value);
        lista.innerHTML = items.length === 0 ? vacio('No hay álbumes que coincidan.') : `
          <div class="tabla-scroll"><table>
            <tr><th>Título</th><th>Artista</th><th>Año</th><th>Tipo</th><th>Canciones</th></tr>
            ${items.map((a) => `<tr>
              <td><a href="#/album/${a.idAlbum}">${esc(a.titulo)}</a></td>
              <td><a href="#/artista/${a.idArtista}">${esc(a.artista)}</a></td>
              <td>${a.anioLanzamiento}</td><td>${esc(a.tipo)}</td><td>${a.numCanciones}</td></tr>`).join('')}
          </table></div>`;
      } else {
        const items = await api.artistas(q.value);
        lista.innerHTML = items.length === 0 ? vacio('No hay artistas que coincidan.') : `
          <div class="tabla-scroll"><table>
            <tr><th>Nombre</th><th>País de origen</th><th>Tipo</th></tr>
            ${items.map((a) => `<tr>
              <td><a href="#/artista/${a.idArtista}">${esc(a.nombre)}</a></td>
              <td>${esc(a.paisOrigen ?? '')}</td><td>${esc(a.tipo)}</td></tr>`).join('')}
          </table></div>`;
      }
    } catch (e) {
      aviso(e.message, true);
    }
  }

  raiz.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    tab = b.dataset.tab;
    raiz.querySelectorAll('[data-tab]').forEach((x) => x.classList.toggle('activo', x === b));
    cargar();
  }));

  let espera;
  q.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(cargar, 250);
  });
  genero.addEventListener('change', cargar);

  await cargar();
}
