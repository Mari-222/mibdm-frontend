import { esc } from './ui.js';
import { sesion } from './session.js';
import { vistaLogin } from './views/login.js';
import { vistaExplorar } from './views/explorar.js';
import { vistaCancion } from './views/cancion.js';
import { vistaAlbum } from './views/album.js';
import { vistaArtista } from './views/artista.js';
import { vistaHistorial } from './views/historial.js';
import { vistaCalificaciones } from './views/calificaciones.js';
import { vistaPorEscuchar } from './views/porEscuchar.js';
import { vistaEstadisticas } from './views/estadisticas.js';
import { vistaPublicar } from './views/publicar.js';

// Cada ruta (#/nombre/id) apunta a una funcion que dibuja la vista dentro de <main>.
const rutas = {
  explorar: vistaExplorar,
  cancion: vistaCancion,
  album: vistaAlbum,
  artista: vistaArtista,
  historial: vistaHistorial,
  calificaciones: vistaCalificaciones,
  'por-escuchar': vistaPorEscuchar,
  estadisticas: vistaEstadisticas,
  publicar: vistaPublicar,
};

const barra = document.getElementById('barra');
const contenido = document.getElementById('contenido');

function pintarBarra(usuario, rutaActual) {
  const menu = [
    ['explorar', 'Explorar'],
    ['historial', 'Historial'],
    ['calificaciones', 'Calificaciones'],
    ['por-escuchar', 'Por escuchar'],
    ['estadisticas', 'Estadísticas'],
  ];
  if (usuario.tipo === 'artista') menu.push(['publicar', 'Publicar']);

  barra.hidden = false;
  barra.innerHTML = `
    <a class="marca" href="#/explorar">♪ MiBDM</a>
    <nav>${menu.map(([ruta, texto]) =>
      `<a href="#/${ruta}" class="${ruta === rutaActual ? 'activo' : ''}">${texto}</a>`).join('')}</nav>
    <div class="sesion">
      <span>${esc(usuario.nombre)} ${esc(usuario.apellido)}${usuario.tipo === 'artista' ? ' (artista)' : ''}</span>
      <button class="secundario chiquito" id="salir">Salir</button>
    </div>`;
  document.getElementById('salir').addEventListener('click', () => {
    sesion.cerrar();
    location.hash = '';
    navegar();
  });
}

async function navegar() {
  const usuario = sesion.obtener();
  if (!usuario) {
    barra.hidden = true;
    vistaLogin(contenido, () => {
      location.hash = '#/explorar';
      navegar();
    });
    return;
  }

  const [ruta, id] = location.hash.replace(/^#\/?/, '').split('/');
  const nombre = rutas[ruta] ? ruta : 'explorar';
  pintarBarra(usuario, nombre);
  contenido.innerHTML = '<p class="suave">Cargando…</p>';
  try {
    await rutas[nombre](contenido, usuario, id ? Number(id) : undefined);
  } catch (e) {
    contenido.innerHTML = `<div class="vacio">${esc(e.message)}</div>`;
  }
}

window.addEventListener('hashchange', navegar);
navegar();
