import { api } from '../api.js';
import { esc, fmtFechaHora, fmtDuracion, montar, vacio, aviso, intentar } from '../ui.js';

export async function vistaHistorial(el, usuario) {
  const escuchas = await api.escuchas(usuario.idUsuario, 100);

  const raiz = montar(el, `
    <h2>Mi historial de escuchas</h2>
    ${escuchas.length === 0
      ? vacio('Aún no has registrado escuchas. Busca algo en Explorar y regístralo.')
      : `<div class="tabla-scroll"><table>
          <tr><th>Fecha</th><th>Qué escuchaste</th><th>Artista</th><th>Plataforma</th><th>Tiempo</th><th></th></tr>
          ${escuchas.map((e) => `<tr>
            <td>${fmtFechaHora(e.fechaHora)}</td>
            <td><a href="#/${e.tipoItem}/${e.idCancion ?? e.idAlbum}">${esc(e.titulo)}</a>
                ${e.tipoItem === 'album' ? '<span class="etiqueta">álbum</span>' : ''}</td>
            <td>${esc(e.artista ?? '')}</td>
            <td>${esc(e.plataforma)}</td>
            <td>${fmtDuracion(e.segundosEscuchados)}</td>
            <td><button class="peligro chiquito" data-borrar="${e.idEscucha}">Borrar</button></td>
          </tr>`).join('')}
        </table></div>`}`);

  raiz.addEventListener('click', async (ev) => {
    const boton = ev.target.closest('[data-borrar]');
    if (!boton) return;
    const ok = await intentar(async () => {
      await api.borrarEscucha(usuario.idUsuario, boton.dataset.borrar);
      return true;
    });
    if (ok) {
      aviso('Escucha eliminada');
      vistaHistorial(el, usuario);
    }
  });
}
