import { api } from '../api.js';
import { esc, fmtFecha, montar, vacio, aviso, intentar } from '../ui.js';

const PRIORIDADES = ['alta', 'media', 'baja'];
const ESTADOS = ['pendiente', 'escuchado', 'descartado'];

const opciones = (lista, actual) =>
  lista.map((v) => `<option value="${v}" ${v === actual ? 'selected' : ''}>${v}</option>`).join('');

export async function vistaPorEscuchar(el, usuario) {
  const u = usuario.idUsuario;
  const items = await api.porEscuchar(u);

  const raiz = montar(el, `
    <h2>Por escuchar</h2>
    ${items.length === 0
      ? vacio('Tu lista está vacía. Entra a un álbum y agrégalo desde su página.')
      : `<div class="tabla-scroll"><table>
          <tr><th>Álbum</th><th>Artista</th><th>Agregado</th><th>Prioridad</th><th>Estado</th><th></th></tr>
          ${items.map((p) => `<tr data-id="${p.idAlbum}">
            <td><a href="#/album/${p.idAlbum}">${esc(p.titulo)}</a></td>
            <td>${esc(p.artista)}</td>
            <td>${fmtFecha(p.fechaAgregado)}</td>
            <td><select data-campo="prioridad" aria-label="Prioridad">${opciones(PRIORIDADES, p.prioridad)}</select></td>
            <td><select data-campo="estado" aria-label="Estado">${opciones(ESTADOS, p.estado)}</select></td>
            <td><button class="peligro chiquito" data-quitar>Quitar</button></td>
          </tr>`).join('')}
        </table></div>`}`);

  // Cada cambio de prioridad o estado se guarda de inmediato
  raiz.addEventListener('change', async (ev) => {
    const campo = ev.target.dataset.campo;
    if (!campo) return;
    const id = Number(ev.target.closest('tr').dataset.id);
    const ok = await intentar(async () => {
      await api.actualizarPorEscuchar(u, id, { [campo]: ev.target.value });
      return true;
    });
    if (ok) aviso('Cambio guardado');
  });

  raiz.addEventListener('click', async (ev) => {
    if (!ev.target.closest('[data-quitar]')) return;
    const id = Number(ev.target.closest('tr').dataset.id);
    const ok = await intentar(async () => {
      await api.quitarPorEscuchar(u, id);
      return true;
    });
    if (ok) {
      aviso('Álbum quitado de la lista');
      vistaPorEscuchar(el, usuario);
    }
  });
}
