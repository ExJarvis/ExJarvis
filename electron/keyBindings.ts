import { globalShortcut } from 'electron';

const keyBindings = (mainWindow: Electron.BrowserWindow | null, devWindow?: Electron.BrowserWindow | null) => {
  globalShortcut.register('Ctrl+Shift+Space', () => {
    mainWindow?.show();
    return false;
  });
  devWindow && globalShortcut.register('Ctrl+Alt+Space', () => {
    devWindow?.show();
    return false;
  });

  mainWindow?.on('closed', () => {
    mainWindow = null;
  });
  mainWindow?.on('focus', () => {
    globalShortcut.register('Esc', () => {
      mainWindow?.hide();
      return false;
    });
  });
  mainWindow?.on('blur', () => {
    // mainWindow?.close();
    mainWindow?.hide();
    globalShortcut.unregister('Esc');
  });

  devWindow?.on('closed', () => {
    devWindow = null;
  });
  devWindow?.on('focus', () => {
    globalShortcut.register('Esc', () => {
      devWindow?.hide();
      return false;
    });
  });
  devWindow?.on('blur', () => {
    // devWindow?.hide();
    globalShortcut.unregister('Esc');
  });
};

export default keyBindings;
