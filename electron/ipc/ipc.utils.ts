import { ipcMain } from 'electron';
import { RestEndpoints, PushEndpoints } from '../../types/ipc.types';
import { windows } from '../globals';

export const onSendSync = <K extends keyof RestEndpoints>(
  channel: K,
  callback: (
    event: Electron.IpcMainEvent,
    ...args: Parameters<RestEndpoints[K]>
  ) => ReturnType<RestEndpoints[K]>
) => {
  ipcMain.on(channel, (event, ...args) => {
    const ret = callback(event, ...(args as any));
    event.returnValue = ret;
  });
};

export const webSend = <K extends keyof PushEndpoints>(
  channel: K,
  ...args: Parameters<PushEndpoints[K]>
): void => {
  windows?.forEach((win) => {
      win?.webContents.send(channel, ...args)
  });
};
