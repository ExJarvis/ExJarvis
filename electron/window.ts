import { BrowserWindow } from 'electron';

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
