import { api } from '../api.js';
import { sesion } from '../session.js';
import { montar, aviso, intentar } from '../ui.js';

const DEMO = [
  ['mari.gonzalez@gmail.com', 'Mariana'],
  ['juno.numi@gmail.com', 'Joselyn'],
  ['kevin.quiroz@gmail.com', 'Kevin'],
  ['mateo.solis@example.com', 'Mateo (artista)'],
];

export function vistaLogin(el, alEntrar) {
  const raiz = montar(el, `
    <div class="login">
      <h1>♪ MiBDM</h1>
      <p class="suave">Tu historial de escuchas, calificaciones y música pendiente.</p>

      <div class="panel" id="panel-login">
        <h2>Entrar</h2>
        <form id="form-login">
          <div class="campo">
            <label for="correo">Correo</label>
            <input id="correo" name="correo" type="email" required autofocus>
          </div>
          <button type="submit">Entrar</button>
          <button type="button" class="secundario" id="ir-registro">Crear cuenta</button>
        </form>
        <p class="chico suave" style="margin-bottom:0">Usuarios de prueba:
          ${DEMO.map(([c, n]) => `<a href="#" data-correo="${c}">${n}</a>`).join(' · ')}</p>
      </div>

      <div class="panel" id="panel-registro" hidden>
        <h2>Crear cuenta</h2>
        <form id="form-registro">
          <div class="campo"><label for="nombre">Nombre</label><input id="nombre" name="nombre" required></div>
          <div class="campo"><label for="apellido">Apellido</label><input id="apellido" name="apellido" required></div>
          <div class="campo"><label for="correo-r">Correo</label><input id="correo-r" name="correo" type="email" required></div>
          <div class="campo"><label for="pais">País</label><input id="pais" name="pais"></div>
          <button type="submit">Registrarme</button>
          <button type="button" class="secundario" id="ir-login">Ya tengo cuenta</button>
        </form>
      </div>
    </div>`);

  const panelLogin = raiz.querySelector('#panel-login');
  const panelRegistro = raiz.querySelector('#panel-registro');

  raiz.querySelector('#ir-registro').addEventListener('click', () => {
    panelLogin.hidden = true;
    panelRegistro.hidden = false;
  });
  raiz.querySelector('#ir-login').addEventListener('click', () => {
    panelRegistro.hidden = true;
    panelLogin.hidden = false;
  });

  raiz.querySelectorAll('[data-correo]').forEach((a) => a.addEventListener('click', (ev) => {
    ev.preventDefault();
    raiz.querySelector('#correo').value = a.dataset.correo;
  }));

  raiz.querySelector('#form-login').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const correo = new FormData(ev.target).get('correo');
    const usuario = await intentar(() => api.login(correo));
    if (usuario) {
      sesion.guardar(usuario);
      alEntrar();
    }
  });

  raiz.querySelector('#form-registro').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const datos = Object.fromEntries(new FormData(ev.target));
    const usuario = await intentar(() => api.registrar(datos));
    if (usuario) {
      aviso('Cuenta creada');
      sesion.guardar(usuario);
      alEntrar();
    }
  });
}
