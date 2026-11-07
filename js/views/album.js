import { api } from '../api.js';
import { formEscucha, formCalificar } from '../components.js';
import { esc, fmtDuracion, montar, promedioTexto, aviso, intentar } from '../ui.js';

export async function vistaAlbum(el, usuario, id) {
  if (!id) {
    location.hash = '#/explorar';
    return;
  }
  const [d, plataformas] = await Promise.all([api.album(id), api.plataformas()]);
  const a = d.album;

  const raiz = montar(el, `
    <p><a href="#/explorar">← Explorar</a></p>
    <div class="panel">
      <h2>${esc(a.titulo)}</h2>
      <p><a href="#/artista/${a.idArtista}">${esc(a.artista)}</a>
        <span class="suave">· ${a.anioLanzamiento} · ${esc(a.tipo)} · ${a.numCanciones} canciones</span></p>
      <p>${promedioTexto(d.promedio, d.totalCalificaciones)}</p>
      <div class="tabla-scroll"><table>
        <tr><th>#</th><th>Título</th><th>Duración</th></tr>
        ${d.canciones.map((c) => `<tr>
          <td>${c.numeroPista ?? ''}</td>
          <td><a href="#/cancion/${c.idCancion}">${esc(c.titulo)}</a></td>
          <td>${fmtDuracion(c.duracionSeg)}</td></tr>`).join('')}
      </table></div>
    </div>
    <div class="grid-2">
      <div class="panel" id="escucha"></div>
      <div class="panel" id="calif"></div>
    </div>
    <div class="panel">
      <h3 style="margin-top:0">Por escuchar</h3>
      <form class="fila" id="form-pe">
        <div class="campo">
          <label for="prioridad">Prioridad</label>
          <select id="prioridad" name="prioridad">
            <option value="alta">Alta</option><option value="media" selected>Media</option><option value="baja">Baja</option>
          </select>
        </div>
        <button type="submit">Agregar a mi lista</button>
      </form>
    </div>`);

  formEscucha(raiz.querySelector('#escucha'), { usuario, plataformas, idAlbum: id });
  await formCalificar(raiz.querySelector('#calif'), {
    usuario, tipo: 'album', id,
    onCambio: () => vistaAlbum(el, usuario, id),
  });

  raiz.querySelector('#form-pe').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const prioridad = new FormData(ev.target).get('prioridad');
    const ok = await intentar(async () => {
      await api.agregarPorEscuchar(usuario.idUsuario, id, prioridad);
      return true;
    });
    if (ok) aviso('Álbum agregado a tu lista por escuchar');
  });
}
