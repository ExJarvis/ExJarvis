import { ipcMain } from 'electron';
import { CRUDEvents, PushEvents } from '../../types/ipc.types';
import { windows } from '../globals';

export const onSendSync = <K extends keyof CRUDEvents>(
  channel: K,
  callback: (
    event: Electron.IpcMainEvent,
    ...args: Parameters<CRUDEvents[K]>
  ) => ReturnType<CRUDEvents[K]>
) => {
  ipcMain.on(channel, (event, ...args) => {
    const ret = callback(event, ...(args as any));
    event.returnValue = ret;
  });
};

export const webSend = <K extends keyof PushEvents>(
  channel: K,
  ...args: Parameters<PushEvents[K]>
): void => {
  windows?.forEach((win) => {
      win?.webContents.send(channel, ...args)
  });
};
