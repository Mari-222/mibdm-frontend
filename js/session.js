// La "sesion" es solo el usuario guardado en el navegador (el BackEnd no usa contrasenas).
const CLAVE = 'mibdm_usuario';

export const sesion = {
  obtener() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE));
    } catch {
      return null;
    }
  },
  guardar(usuario) {
    localStorage.setItem(CLAVE, JSON.stringify(usuario));
  },
  cerrar() {
    localStorage.removeItem(CLAVE);
  },
};
