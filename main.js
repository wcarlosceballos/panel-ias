const { app, BrowserWindow, WebContentsView, ipcMain, shell, session } = require('electron');
const path = require('path');

const PARTITION = 'persist:ias'; // guarda tus sesiones iniciadas entre cierres de la app
let win = null;
let active = null;
let bounds = { x: 0, y: 0, width: 800, height: 600 };
const views = new Map();

function cleanUserAgent() {
  // Quita "Electron/..." y el nombre de la app para que los sitios lo vean como Chrome normal
  return session.fromPartition(PARTITION).getUserAgent()
    .replace(/ Electron\/[\d.]+/, '')
    .replace(/ [A-Za-z0-9_-]+\/[\d.]+(?= Chrome\/)/, '');
}

function applyBounds() {
  if (active) active.setBounds(bounds);
}

function getView(key, url) {
  if (views.has(key)) return views.get(key);
  const view = new WebContentsView({ webPreferences: { partition: PARTITION } });
  view.webContents.setUserAgent(cleanUserAgent());
  // Permite ventanas emergentes (por ejemplo, el inicio de sesión con Google)
  view.webContents.setWindowOpenHandler(() => ({ action: 'allow' }));
  view.webContents.loadURL(url);
  win.contentView.addChildView(view);
  views.set(key, view);
  return view;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 820,
    minHeight: 520,
    backgroundColor: '#0f0c29',
    title: 'Panel de IAs',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

ipcMain.handle('show', (_e, key, url) => {
  const view = getView(key, url);
  for (const v of views.values()) v.setVisible(v === view);
  active = view;
  applyBounds();
});

ipcMain.handle('hide', () => {
  for (const v of views.values()) v.setVisible(false);
  active = null;
});

ipcMain.on('bounds', (_e, b) => {
  bounds = { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
  applyBounds();
});

ipcMain.on('external', (_e, url) => {
  if (/^https?:\/\//.test(url)) shell.openExternal(url);
});

ipcMain.on('reload', () => { if (active) active.webContents.reload(); });

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
