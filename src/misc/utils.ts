import { ipcRenderer } from 'electron';
import { RestEndpoints, PushEndpoints } from '../../types/ipc.types';

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

export const sendSync = <K extends keyof RestEndpoints>(
  channel: K,
  ...args: Parameters<RestEndpoints[K]>
): ReturnType<RestEndpoints[K]> => {
  return ipcRenderer.sendSync(channel, ...args);
};

export const onWebSend = <K extends keyof PushEndpoints>(
  channel: K,
  callback: (
    event: Electron.IpcRendererEvent,
    ...args: Parameters<PushEndpoints[K]>
  ) => void,
): {
  unsubscribe: () => void;
} => {
  const handler = (event: Electron.IpcRendererEvent, ...args: any[]) => {
    const ret = callback(event, ...(args as any));
    // event.returnValue = ret;
  };

  ipcRenderer.on(channel, handler);

  return {
    unsubscribe: () => {
      ipcRenderer.removeListener(channel, handler);
    },
  };
};
