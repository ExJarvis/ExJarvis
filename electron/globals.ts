const initGlobals = () => {
  (global as any).path = require('path');
};

export const windows: Electron.BrowserWindow[] = [];

export default initGlobals;
