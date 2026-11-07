// Formularios que se repiten en las paginas de cancion y de album.
import { api } from './api.js';
import { esc, aviso, intentar } from './ui.js';

/** Formulario "Registrar escucha". Se le pasa idCancion o idAlbum. */
export function formEscucha(el, { usuario, plataformas, idCancion, idAlbum }) {
  el.innerHTML = `
    <h3 style="margin-top:0">Registrar escucha</h3>
    <form>
      <div class="campo">
        <label for="plataforma">Plataforma</label>
        <select id="plataforma" name="plataforma">
          ${plataformas.map((p) => `<option value="${p.idPlataforma}">${esc(p.nombre)}</option>`).join('')}
        </select>
      </div>
      <div class="campo">
        <label for="segundos">Segundos escuchados (vacío = completo)</label>
        <input id="segundos" name="segundos" type="number" min="0">
      </div>
      <button type="submit">Registrar escucha</button>
    </form>`;

  const form = el.querySelector('form');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(form);
    const datos = {
      idCancion: idCancion ?? null,
      idAlbum: idAlbum ?? null,
      idPlataforma: Number(f.get('plataforma')),
      segundosEscuchados: f.get('segundos') === '' ? null : Number(f.get('segundos')),
    };
    const r = await intentar(() => api.registrarEscucha(usuario.idUsuario, datos));
    if (r) {
      aviso('Escucha registrada');
      form.reset();
    }
  });
}

/** Formulario para calificar (o modificar/eliminar la calificacion) de una cancion o de un album. */
export async function formCalificar(el, { usuario, tipo, id, onCambio }) {
  const u = usuario.idUsuario;
  const lista = tipo === 'cancion' ? await api.calificacionesCanciones(u) : await api.calificacionesAlbumes(u);
  const actual = lista.find((c) => c.idItem === id);

  el.innerHTML = `
    <h3 style="margin-top:0">${actual ? 'Tu calificación' : 'Calificar'}</h3>
    <form>
      <div class="campo">
        <label for="puntuacion">Puntuación</label>
        <select id="puntuacion" name="puntuacion">
          ${[5, 4, 3, 2, 1].map((n) =>
            `<option value="${n}" ${actual?.puntuacion === n ? 'selected' : ''}>${'★'.repeat(n)} (${n})</option>`).join('')}
        </select>
      </div>
      <div class="campo">
        <label for="comentario">Comentario (opcional)</label>
        <input id="comentario" name="comentario" maxlength="255" value="${esc(actual?.comentario ?? '')}">
      </div>
      <button type="submit">Guardar</button>
      ${actual ? '<button type="button" class="peligro" id="borrar">Eliminar</button>' : ''}
    </form>`;

  const form = el.querySelector('form');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(form);
    const datos = { puntuacion: Number(f.get('puntuacion')), comentario: f.get('comentario') };
    const guardar = tipo === 'cancion' ? api.calificarCancion : api.calificarAlbum;
    const ok = await intentar(async () => { await guardar(u, id, datos); return true; });
    if (ok) {
      aviso('Calificación guardada');
      onCambio();
    }
  });

  el.querySelector('#borrar')?.addEventListener('click', async () => {
    const borrar = tipo === 'cancion' ? api.borrarCalifCancion : api.borrarCalifAlbum;
    const ok = await intentar(async () => { await borrar(u, id); return true; });
    if (ok) {
      aviso('Calificación eliminada');
      onCambio();
    }
  });
}
