import { app } from 'electron';
import configureExtensions from './extensions';
import { DEBUG } from './constants';
import { getDevWindow, getWindow } from './window';
import keyBindings from './keyBindings';
import { registerClipboardIpc } from './clipboard';
import renderer from './renderer';

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

const main = () => {
  app.on('ready', initWindow).whenReady().then(configureExtensions);
  app.allowRendererProcessReuse = true;
};

main();
