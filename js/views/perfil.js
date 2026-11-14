import { api } from '../api.js';
import { sesion } from '../session.js';
import { esc, fmtFecha, montar, aviso, intentar } from '../ui.js';

/** Mi perfil: modificar los datos de la cuenta y, si es artista, su perfil de artista. */
export async function vistaPerfil(el, usuario) {
  // Se vuelve a pedir al servidor para mostrar siempre los datos actuales.
  const yo = await api.usuario(usuario.idUsuario);
  const esArtista = yo.tipo === 'artista' && yo.idArtista != null;
  const artista = esArtista ? (await api.artista(yo.idArtista)).artista : null;

  const raiz = montar(el, `
    <h2>Mi perfil</h2>
    <p class="suave">Cuenta ${esArtista ? 'de artista' : 'normal'} · miembro desde ${fmtFecha(yo.fechaRegistro)}</p>
    <form id="form-perfil">
      <div class="panel">
        <h3 style="margin-top:0">Mis datos</h3>
        <div class="grid-2">
          <div class="campo"><label for="p-nombre">Nombre</label>
            <input id="p-nombre" name="nombre" value="${esc(yo.nombre)}" required></div>
          <div class="campo"><label for="p-apellido">Apellido</label>
            <input id="p-apellido" name="apellido" value="${esc(yo.apellido)}" required></div>
          <div class="campo"><label for="p-correo">Correo</label>
            <input id="p-correo" name="correo" type="email" value="${esc(yo.correo)}" required></div>
          <div class="campo"><label for="p-pais">País</label>
            <input id="p-pais" name="pais" value="${esc(yo.pais)}"></div>
        </div>
      </div>
      ${esArtista ? `
      <div class="panel">
        <h3 style="margin-top:0">Mi perfil de artista</h3>
        <div class="grid-2">
          <div class="campo"><label for="p-nombre-artista">Nombre artístico</label>
            <input id="p-nombre-artista" name="nombreArtista" value="${esc(artista.nombre)}" required></div>
          <div class="campo"><label for="p-tipo-artista">Tipo de artista</label>
            <select id="p-tipo-artista" name="tipoArtista">
              <option value="solista" ${artista.tipo === 'solista' ? 'selected' : ''}>Solista</option>
              <option value="banda" ${artista.tipo === 'banda' ? 'selected' : ''}>Banda</option>
            </select></div>
        </div>
      </div>` : ''}
      <button type="submit">Guardar cambios</button>
    </form>`);

  raiz.querySelector('#form-perfil').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const datos = {
      nombre: f.get('nombre'),
      apellido: f.get('apellido'),
      correo: f.get('correo'),
      pais: f.get('pais'),
    };
    if (esArtista) {
      datos.artista = {
        nombre: f.get('nombreArtista'),
        paisOrigen: f.get('pais'), // un solo pais: el de la cuenta es tambien el de origen del artista
        tipo: f.get('tipoArtista'),
      };
    }
    const actualizado = await intentar(() => api.actualizarUsuario(yo.idUsuario, datos));
    if (actualizado) {
      sesion.guardar(actualizado);
      aviso('Perfil actualizado');
      // vuelve a pintar la barra (con el nombre nuevo) y la vista
      window.dispatchEvent(new Event('hashchange'));
    }
  });
}
