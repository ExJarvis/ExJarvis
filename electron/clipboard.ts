import { clipboard, ipcMain } from 'electron';

let current: string = "";
const history: string[] = [];

export const registerClipboardIpc = () => {
  ipcMain.on('writeText', (event, arg) => {
    event.returnValue = clipboard.writeText(arg);
  });

  ipcMain.on('readText', (event, arg) => {
    event.returnValue = clipboard.readText();
  });

  ipcMain.on('readState', (event, arg) => {
    event.returnValue = {
      current,
      history,
    };
  });

  monitorClipboard();
};

const monitorClipboard = () => {
  const newClip = clipboard.readText();
  // console.log({ newClip });
  if (newClip !== current) {
    current = newClip;
    handleClipboardChange(newClip);
  }
  setTimeout(monitorClipboard, 100)
};

const handleClipboardChange = (val: string) => {
  current = val;
  history.push(val);
};
