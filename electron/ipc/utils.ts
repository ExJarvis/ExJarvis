import { ipcMain } from 'electron';
import { ToMainEvents, ToRendererEvents } from '../../types/ipc.types';
import { windows } from '../globals';

export const onSendSync = <K extends keyof ToMainEvents>(
  channel: K,
  callback: (
    event: Electron.IpcMainEvent,
    ...args: Parameters<ToMainEvents[K]>
  ) => ReturnType<ToMainEvents[K]>
) => {
  ipcMain.on(channel, (event, ...args) => {
    const ret = callback(event, ...(args as any));
    event.returnValue = ret;
  });
};

export const webSend = <K extends keyof ToRendererEvents>(
  channel: K,
  ...args: Parameters<ToRendererEvents[K]>
): void => {
  windows?.forEach((win) => {
      win?.webContents.send(channel, ...args)
  });
};
