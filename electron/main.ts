import { app } from 'electron';
import configureExtensions from './extensions';
import { getDevWindow, getWindow } from './window';
import keyBindings from './keyBindings';
import { registerClipboardIpc } from './ipc/clipboard.ipc';
import renderer from './renderer';
import { DEBUG, env } from './constants';
import initGlobals, { windows } from './globals';
import * as Sentry from "@sentry/electron";

export const initWindow = () => {
  const mainWindow = getWindow();
  windows.push(mainWindow);

  const devWindow = DEBUG ? getDevWindow() : null;
  devWindow && windows.push(devWindow);

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

const logErrors = () => {
  process.on('uncaughtException', function (err) {
    console.error(err);
  })
};

const initSentry = () => {
  Sentry.init({ dsn: "https://c8f88d7866e442d3927ccd924b7b9ecf@o306873.ingest.sentry.io/1766096" });
};

const main = () => {
  initGlobals();
  app.on('ready', initWindow).whenReady().then(configureExtensions);
  app.allowRendererProcessReuse = true;
  initHotRelaod();
  logErrors();
  initSentry();
};

main();
