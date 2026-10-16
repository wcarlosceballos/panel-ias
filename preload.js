const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  show: (key, url) => ipcRenderer.invoke('show', key, url),
  hide: () => ipcRenderer.invoke('hide'),
  bounds: (b) => ipcRenderer.send('bounds', b),
  external: (url) => ipcRenderer.send('external', url),
  reload: () => ipcRenderer.send('reload')
});
