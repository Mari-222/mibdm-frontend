import { api } from '../api.js';
import { esc, fmtFecha, estrellas, montar, vacio, aviso, intentar } from '../ui.js';

function tabla(items, tipo) {
  if (items.length === 0) return vacio('Todavía no hay calificaciones.');
  return `<div class="tabla-scroll"><table>
    <tr><th>Título</th><th>Puntuación</th><th>Comentario</th><th>Fecha</th><th></th></tr>
    ${items.map((c) => `<tr data-tipo="${tipo}" data-id="${c.idItem}">
      <td><a href="#/${tipo}/${c.idItem}">${esc(c.titulo)}</a></td>
      <td>
        <select data-campo="puntuacion" aria-label="Puntuación">
          ${[5, 4, 3, 2, 1].map((n) =>
            `<option value="${n}" ${n === c.puntuacion ? 'selected' : ''}>${estrellas(n)}</option>`).join('')}
        </select>
      </td>
      <td><input data-campo="comentario" maxlength="255" value="${esc(c.comentario ?? '')}" aria-label="Comentario"></td>
      <td>${fmtFecha(c.fecha)}</td>
      <td style="white-space:nowrap">
        <button class="chiquito" data-accion="guardar">Guardar</button>
        <button class="peligro chiquito" data-accion="borrar">Borrar</button>
      </td>
    </tr>`).join('')}
  </table></div>`;
}

export async function vistaCalificaciones(el, usuario) {
  const u = usuario.idUsuario;
  const [canciones, albumes] = await Promise.all([
    api.calificacionesCanciones(u),
    api.calificacionesAlbumes(u),
  ]);

  const raiz = montar(el, `
    <h2>Mis calificaciones</h2>
    <h3>Canciones</h3>${tabla(canciones, 'cancion')}
    <h3>Álbumes</h3>${tabla(albumes, 'album')}`);

  raiz.addEventListener('click', async (ev) => {
    const boton = ev.target.closest('[data-accion]');
    if (!boton) return;
    const fila = boton.closest('tr');
    const id = Number(fila.dataset.id);
    const esCancion = fila.dataset.tipo === 'cancion';

    const ok = await intentar(async () => {
      if (boton.dataset.accion === 'guardar') {
        const datos = {
          puntuacion: Number(fila.querySelector('[data-campo="puntuacion"]').value),
          comentario: fila.querySelector('[data-campo="comentario"]').value,
        };
        await (esCancion ? api.calificarCancion : api.calificarAlbum)(u, id, datos);
      } else {
        await (esCancion ? api.borrarCalifCancion : api.borrarCalifAlbum)(u, id);
      }
      return true;
    });
    if (ok) {
      aviso(boton.dataset.accion === 'guardar' ? 'Calificación guardada' : 'Calificación eliminada');
      vistaCalificaciones(el, usuario);
    }
  });
}
