import * as url from 'url';
import path from 'path';

const renderer = (window: Electron.BrowserWindow) => {
  if (process.env.NODE_ENV === 'development') {
    window?.loadURL('http://localhost:4000');
  } else {
    window?.loadURL(
      url.format({
        pathname: path.join(__dirname, './renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }
};

export default renderer;
