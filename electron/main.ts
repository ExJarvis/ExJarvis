import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer';
import { registerClipboardIpc } from './clipboard';

let mainWindow: Electron.BrowserWindow | null;
const DEBUG = true;

app
  .on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  });
app.allowRendererProcessReuse = true;

function createWindow() {
  DEBUG ? initWindowDev() : initWindow();
  loadUrl();
  mainWindow.setAlwaysOnTop(true, 'screen');
  bindKeyboardShortcuts();
  // registerIpc();
  registerClipboardIpc();
}

const initWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
  });
};

const initWindowDev = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
    },
    frame: true,
  });
};

const loadUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000');
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }
};

const bindKeyboardShortcuts = () => {
  globalShortcut.register('Ctrl+Shift+Space', () => {
    mainWindow?.show();
    return false;
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.on('focus', () => {
    globalShortcut.register('Esc', () => {
      mainWindow?.hide();
      return false;
    });
  });
  mainWindow.on('blur', () => {
    // mainWindow?.close();
    !DEBUG && mainWindow?.hide();
    globalShortcut.unregister('Esc');
  });
};

// const registerIpc = () => {
//   ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong')
//   })

//   ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.returnValue = 'pong'
//   })
// };
