# Panel de IAs

**Aplicación de escritorio para trabajar con varias herramientas de IA en una sola ventana.**

Menú lateral con tus herramientas de IA cargadas como paneles embebidos, cada una con su
propia sesión persistente entre cierres y aperturas de la aplicación.

![Electron](https://img.shields.io/badge/Electron-33-47848F?logo=electron&logoColor=white)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

---

## Por qué existe

Trabajar con herramientas de IA suele significar: abrir cinco pestañas, que cinco pestañas
no sobreviven al cierre del navegador, y que al volver a abrirlas haya que reconfigurar
todo. Este panel mantiene cada herramienta en su propio contexto, con su sesión iniciada
persistida.

## Requisitos

- **Node.js** LTS — <https://nodejs.org>

## Instalación y uso

```bash
npm install
npm start
```

## Generar un instalador

```bash
npm run dist
```

El instalador queda en `dist/`. El `electron-builder` está configurado para **Windows**
(NSIS), **macOS** (DMG) y **Linux** (AppImage).

## Personalización

Las herramientas, sus enlaces y sus usos están en el arreglo `ias` dentro de `index.html`.
No hace falta tocar el resto de la aplicación.

## Cómo funciona

| Pieza | Función |
|---|---|
| `main.js` | Ventana principal, gestión de paneles (`WebContentsView`), ciclo de vida |
| `preload.js` | Puente seguro entre el proceso principal y la interfaz |
| `index.html` | Menú lateral y definición de las herramientas de IA |

**Detalles de implementación:**

- **Sesiones persistentes** — cada panel usa la partición `persist:ias`, de modo que las
  sesiones iniciadas sobreviven al cierre de la aplicación.
- **User agent limpio** — se elimina la huella de `Electron/` para que los sitios web
  detecten un navegador normal, lo que evita incompatibilidades con servicios que
  rechazan clientes automatizados.

## Estructura

```
panel-ias/
├── main.js          ← ventana, paneles, sesiones
├── preload.js       ← puente main ↔ interfaz
├── index.html       ← menú lateral y arreglo "ias"
├── package.json     ← configuración de electron-builder
└── LEEME.txt        ← instrucciones breves de uso
```

---

## Licencia

MIT.

---

<div align="center">

**Walberto Carlos Ceballos Sierra** · [GitHub](https://github.com/wcarlosceballos)

</div>