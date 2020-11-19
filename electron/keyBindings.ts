import { globalShortcut, Menu } from 'electron';
import { app } from 'electron';
import { hideWindow, showWindow } from './window';

const keyBindings = (mainWindow: Electron.BrowserWindow | null, devWindow?: Electron.BrowserWindow | null) => {
  globalShortcut.register('Ctrl+Shift+Space', () => {
    showWindow(mainWindow);
    return false;
  });
  devWindow && globalShortcut.register('Ctrl+Alt+Space', () => {
    showWindow(devWindow);
    return false;
  });

  mainWindow?.on('closed', () => {
    mainWindow = null;
  });
  mainWindow?.on('focus', () => {
    globalShortcut.register('Esc', () => {
      hideWindow(mainWindow);
      return false;
    });
  });
  mainWindow?.on('blur', () => {
    hideWindow(mainWindow);
    globalShortcut.unregister('Esc');
  });

  devWindow?.on('closed', () => {
    devWindow = null;
  });
  devWindow?.on('focus', () => {
    globalShortcut.register('Esc', () => {
      hideWindow(devWindow);
      return false;
    });
  });
  devWindow?.on('blur', () => {
    // hideWindow(devWindow);
    globalShortcut.unregister('Esc');
  });
};

export default keyBindings;
