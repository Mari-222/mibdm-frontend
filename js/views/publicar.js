import { api } from '../api.js';
import { esc, montar, vacio, aviso, intentar } from '../ui.js';

/** Vista solo para usuarios de tipo 'artista': registrar álbumes y canciones de su catálogo. */
export async function vistaPublicar(el, usuario) {
  if (usuario.tipo !== 'artista') {
    montar(el, vacio('Esta sección es solo para usuarios de tipo artista.'));
    return;
  }

  const [artistas, albumes, generos] = await Promise.all([api.artistas(), api.albumes(), api.generos()]);

  const raiz = montar(el, `
    <h2>Publicar en mi catálogo</h2>

    <div class="panel">
      <h3 style="margin-top:0">Nuevo álbum</h3>
      <form id="form-album">
        <div class="fila">
          <div class="campo"><label for="a-titulo">Título</label><input id="a-titulo" name="titulo" required maxlength="150"></div>
          <div class="campo"><label for="a-anio">Año</label><input id="a-anio" name="anio" type="number" min="1900" max="2100" required></div>
          <div class="campo"><label for="a-tipo">Tipo</label>
            <select id="a-tipo" name="tipo">
              <option value="LP">LP</option><option value="EP">EP</option>
              <option value="sencillo">sencillo</option><option value="recopilatorio">recopilatorio</option>
            </select></div>
          <div class="campo"><label for="a-artista">Artista</label>
            <select id="a-artista" name="artista">
              ${artistas.map((a) => `<option value="${a.idArtista}">${esc(a.nombre)}</option>`).join('')}
            </select></div>
        </div>
        <p><button type="submit">Crear álbum</button></p>
      </form>
    </div>

    <div class="panel">
      <h3 style="margin-top:0">Nueva canción</h3>
      <form id="form-cancion">
        <div class="fila">
          <div class="campo"><label for="c-titulo">Título</label><input id="c-titulo" name="titulo" required maxlength="150"></div>
          <div class="campo"><label for="c-dur">Duración (segundos)</label><input id="c-dur" name="duracion" type="number" min="1" required></div>
        </div>
        <div class="fila" style="margin-top:12px">
          <div class="campo"><label for="c-album">Álbum</label>
            <select id="c-album" name="album">
              <option value="">Sencillo (sin álbum)</option>
              ${albumes.map((a) => `<option value="${a.idAlbum}">${esc(a.titulo)} · ${esc(a.artista)}</option>`).join('')}
            </select></div>
          <div class="campo"><label for="c-pista">Número de pista (solo con álbum)</label><input id="c-pista" name="pista" type="number" min="1"></div>
        </div>
        <div class="campo" style="margin-top:12px"><label>Intérpretes</label>
          <div class="checks">${artistas.map((a) =>
            `<label><input type="checkbox" name="interpretes" value="${a.idArtista}"> ${esc(a.nombre)}</label>`).join('')}</div></div>
        <div class="campo"><label>Géneros</label>
          <div class="checks">${generos.map((g) =>
            `<label><input type="checkbox" name="generos" value="${g.idGenero}"> ${esc(g.nombre)}</label>`).join('')}</div></div>
        <button type="submit">Crear canción</button>
      </form>
    </div>`);

  raiz.querySelector('#form-album').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const r = await intentar(() => api.crearAlbum({
      idUsuario: usuario.idUsuario,
      titulo: f.get('titulo'),
      anioLanzamiento: Number(f.get('anio')),
      tipo: f.get('tipo'),
      idArtista: Number(f.get('artista')),
    }));
    if (r) {
      aviso('Álbum creado');
      vistaPublicar(el, usuario);
    }
  });

  raiz.querySelector('#form-cancion').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const r = await intentar(() => api.crearCancion({
      idUsuario: usuario.idUsuario,
      titulo: f.get('titulo'),
      duracionSeg: Number(f.get('duracion')),
      idAlbum: f.get('album') === '' ? null : Number(f.get('album')),
      numeroPista: f.get('pista') === '' ? null : Number(f.get('pista')),
      idsInterpretes: f.getAll('interpretes').map(Number),
      idsGeneros: f.getAll('generos').map(Number),
    }));
    if (r) {
      aviso('Canción creada');
      ev.target.reset();
    }
  });
}
