import { app } from 'electron';
import configureExtensions from './extensions';
import { getDevWindow, getWindow } from './window';
import keyBindings from './keyBindings';
import { registerClipboardIpc } from './ipc/clipboard.ipc';
import renderer from './renderer';
import { DEBUG, env } from './constants';
import initGlobals from './globals';

export const initWindow = () => {
  const mainWindow = getWindow();
  const devWindow = DEBUG ? getDevWindow() : null;
  mainWindow?.setAlwaysOnTop(true, 'screen-saver');
  devWindow?.setAlwaysOnTop(true, 'screen-saver');

  renderer(mainWindow);
  devWindow && renderer(devWindow);

  keyBindings(mainWindow, devWindow);
  registerClipboardIpc();
};

const initHotRelaod = () => {
  // electron-reloader | is not working
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true,
    });
  } catch (_) {
    console.log(_);
  }
};

const main = () => {
  initGlobals();
  app.on('ready', initWindow).whenReady().then(configureExtensions);
  app.allowRendererProcessReuse = true;
  initHotRelaod();
};

main();
