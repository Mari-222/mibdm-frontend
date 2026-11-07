# MiBDM – FrontEnd (Entrega #2, Bases de Datos I)

Aplicación web en **JavaScript (módulos ES), HTML y CSS** sin dependencias ni paso de compilación.
Consume la API REST del repositorio **mibdm-backend** (`http://localhost:8080/api`).

Grupo 2: Mariana González, Kevin Quiroz y Joselyn Nuñez.

## Cómo ejecutarlo

1. Levantar el BackEnd (ver su README): `docker compose up -d` y `mvn spring-boot:run`.
2. Servir esta carpeta con cualquier servidor estático (los módulos ES no funcionan abriendo el `.html` con doble clic):
   * VS Code: extensión **Live Server** → clic derecho en `index.html` → *Open with Live Server*, o
   * Terminal: `npm start` (usa `npx serve` en `http://localhost:5173`), o
   * Terminal: `python -m http.server 5173`
3. Abrir `http://localhost:5173` (o el puerto que muestre Live Server).

Si el BackEnd corre en otra dirección, se cambia en `js/config.js`.

## Usuarios de prueba

`mari.gonzalez@gmail.com`, `juno.numi@gmail.com`, `kevin.quiroz@gmail.com` (normales) y
`mateo.solis@example.com` (tipo **artista**, ve la sección *Publicar*). El inicio de sesión es solo por correo.

## Estructura

```
index.html          página única
css/styles.css      estilos (claro y oscuro automático)
js/config.js        URL de la API
js/api.js           todas las llamadas fetch al BackEnd
js/session.js       usuario guardado en localStorage
js/ui.js            utilidades (escapar HTML, formatos, avisos)
js/components.js    formularios reutilizables: registrar escucha y calificar
js/app.js           menú y enrutador por hash (#/ruta/id)
js/views/           una vista por pantalla
```

## Pantallas

| Ruta | Funcionalidad |
|---|---|
| (login) | Entrar por correo o crear cuenta |
| `#/explorar` | Buscar canciones (con filtro por género), álbumes y artistas |
| `#/cancion/{id}` | Detalle, registrar escucha, calificar |
| `#/album/{id}` | Detalle, registrar escucha del álbum, calificar, agregar a *por escuchar* |
| `#/artista/{id}` | Artista y sus álbumes |
| `#/historial` | Historial de escuchas, con opción de borrar |
| `#/calificaciones` | Ver, modificar y borrar calificaciones de canciones y álbumes |
| `#/por-escuchar` | Lista pendiente: cambiar prioridad/estado o quitar |
| `#/estadisticas` | Totales, top de canciones, artistas y géneros, escuchas por plataforma |
| `#/publicar` | Solo artistas: crear álbumes y canciones |
