import { BrowserWindow, Menu } from 'electron';
import { getOsType } from './utils';

export const getWindow = () => {
  const window = new BrowserWindow({
    width: 600,
    height: 400,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
    transparent: true,
  });

  return window;
};

export const getDevWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
    frame: true,
  });

  return window;
};

export const hideWindow = (wnd?: Electron.BrowserWindow | null) => {
  if(getOsType() === 'mac') {
    Menu.sendActionToFirstResponder('hide:');
    wnd?.hide();
  } else {
    wnd?.hide();
    wnd?.minimize();
  }
};

export const showWindow = (wnd?: Electron.BrowserWindow | null) => {
  wnd?.show();
  wnd?.restore();
};
