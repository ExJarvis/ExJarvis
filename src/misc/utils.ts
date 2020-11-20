import { ipcRenderer } from 'electron';
import { ToMainEvents, ToRendererEvents } from '../../types/ipc.types';

export function isElementInView(el: any) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    top + height <= window.pageYOffset + window.innerHeight &&
    left + width <= window.pageXOffset + window.innerWidth
  );
}

export const sendSync = <K extends keyof ToMainEvents>(
  channel: K,
  ...args: Parameters<ToMainEvents[K]>
): ReturnType<ToMainEvents[K]> => {
  return ipcRenderer.sendSync(channel, ...args);
};

export const onWebSend = <K extends keyof ToRendererEvents>(
  channel: K,
  callback: (
    event: Electron.IpcRendererEvent,
    ...args: Parameters<ToRendererEvents[K]>
  ) => void,
) => {
  ipcRenderer.on(channel, (event, ...args) => {
    const ret = callback(event, ...(args as any));
    // event.returnValue = ret;
  });
};
