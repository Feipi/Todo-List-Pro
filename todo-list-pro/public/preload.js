// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = [];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      // whitelist channels
      let validChannels = [];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    invoke: (channel, data) => {
      // whitelist channels
      let validChannels = [];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      // Return a rejected promise if the channel is not valid
      return Promise.reject(new Error(`Invalid channel: ${channel}`));
    }
  }
});