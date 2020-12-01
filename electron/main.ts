import * as Sentry from '@sentry/electron';
import { app } from 'electron';
import './plugin.app';
import { DEBUG } from './constants';
import configureExtensions from './extensions';
import initGlobals, { windows } from './globals';
import { registerControllers } from './services/controllers';
import keyBindings from './keyBindings';
import renderer from './renderer';
import { getDevWindow, getWindow } from './window';
import { RendererService } from './services/renderer.service';
import { AppService } from './services/app.service';
import { PluginService } from './services/plugin.service';

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

  registerControllers();
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
  });
};

const initSentry = () => {
  Sentry.init({ dsn: 'https://c8f88d7866e442d3927ccd924b7b9ecf@o306873.ingest.sentry.io/1766096' });
};

const initServices = async () => {
  AppService.getInstance();
  RendererService.getInstance();
  PluginService.getInstance();
};

const main = () => {
  initGlobals();
  app.on('ready', initWindow).whenReady().then(configureExtensions);
  app.allowRendererProcessReuse = true;
  initHotRelaod();
  logErrors();
  initSentry();
  initServices();
};

main();
