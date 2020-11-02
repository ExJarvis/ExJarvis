import { ipcRenderer } from 'electron';

export const registerIpc = () => {
  // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

  // ipcRenderer.on('asynchronous-reply', (event, arg) => {
  //   console.log(arg) // prints "pong"
  // });

  // ipcRenderer.send('asynchronous-message', 'ping');

  // ipcRenderer.on('changedText', (even, arg) => {
  //   console.log({ event, arg });
  // });

  monitorClipboard();
};

let oldClip = "";
const clipHistory = [];
const monitorClipboard = () => {
  const newClip = ipcRenderer.sendSync('readText', '');
  if (newClip !== oldClip) {
    oldClip = newClip;
    handleClipboardChange(newClip);
  }
  setTimeout(monitorClipboard, 100)
};

const handleClipboardChange = (val: string) => {
  clipHistory.push(val);
  console.log({ clipHistory })
};
