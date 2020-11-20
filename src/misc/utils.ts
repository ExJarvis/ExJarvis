import { ipcRenderer } from 'electron';
import { IpcEvents } from '../../types/ipc.types';

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

export const sendSync = <K extends keyof IpcEvents>(
  channel: K,
  ...args: Parameters<IpcEvents[K]>
): ReturnType<IpcEvents[K]> => {
  return ipcRenderer.sendSync(channel, ...args);
};
