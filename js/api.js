import { API_URL } from './config.js';

/** Hace la llamada HTTP y devuelve el JSON. Si el servidor responde con error lanza Error(mensaje). */
async function llamar(metodo, ruta, cuerpo) {
  let res;
  try {
    res = await fetch(API_URL + ruta, {
      method: metodo,
      headers: cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {},
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Esta corriendo el BackEnd en ' + API_URL + '?');
  }
  const texto = await res.text();
  const datos = texto ? JSON.parse(texto) : null;
  if (!res.ok) {
    throw new Error(datos?.error ?? 'Error ' + res.status);
  }
  return datos;
}

const qs = (obj) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v);
  });
  const s = p.toString();
  return s ? '?' + s : '';
};

export const api = {
  // usuarios
  login: (correo) => llamar('POST', '/auth/login', { correo }),
  registrar: (datos) => llamar('POST', '/usuarios', datos),
  usuario: (id) => llamar('GET', '/usuarios/' + id),

  // catalogo
  artistas: (q) => llamar('GET', '/artistas' + qs({ q })),
  artista: (id) => llamar('GET', '/artistas/' + id),
  albumes: (q) => llamar('GET', '/albumes' + qs({ q })),
  album: (id) => llamar('GET', '/albumes/' + id),
  canciones: (q, idGenero) => llamar('GET', '/canciones' + qs({ q, idGenero })),
  cancion: (id) => llamar('GET', '/canciones/' + id),
  generos: () => llamar('GET', '/generos'),
  plataformas: () => llamar('GET', '/plataformas'),
  crearAlbum: (datos) => llamar('POST', '/albumes', datos),
  crearCancion: (datos) => llamar('POST', '/canciones', datos),

  // escuchas
  escuchas: (u, limite = 100) => llamar('GET', `/usuarios/${u}/escuchas?limite=${limite}`),
  registrarEscucha: (u, datos) => llamar('POST', `/usuarios/${u}/escuchas`, datos),
  borrarEscucha: (u, id) => llamar('DELETE', `/usuarios/${u}/escuchas/${id}`),

  // calificaciones
  calificacionesCanciones: (u) => llamar('GET', `/usuarios/${u}/calificaciones/canciones`),
  calificarCancion: (u, id, datos) => llamar('PUT', `/usuarios/${u}/calificaciones/canciones/${id}`, datos),
  borrarCalifCancion: (u, id) => llamar('DELETE', `/usuarios/${u}/calificaciones/canciones/${id}`),
  calificacionesAlbumes: (u) => llamar('GET', `/usuarios/${u}/calificaciones/albumes`),
  calificarAlbum: (u, id, datos) => llamar('PUT', `/usuarios/${u}/calificaciones/albumes/${id}`, datos),
  borrarCalifAlbum: (u, id) => llamar('DELETE', `/usuarios/${u}/calificaciones/albumes/${id}`),

  // por escuchar
  porEscuchar: (u) => llamar('GET', `/usuarios/${u}/por-escuchar`),
  agregarPorEscuchar: (u, idAlbum, prioridad) => llamar('POST', `/usuarios/${u}/por-escuchar`, { idAlbum, prioridad }),
  actualizarPorEscuchar: (u, idAlbum, datos) => llamar('PUT', `/usuarios/${u}/por-escuchar/${idAlbum}`, datos),
  quitarPorEscuchar: (u, idAlbum) => llamar('DELETE', `/usuarios/${u}/por-escuchar/${idAlbum}`),

  // estadisticas
  estadisticas: (u) => llamar('GET', `/usuarios/${u}/estadisticas`),
};
