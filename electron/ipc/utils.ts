import { ipcMain } from 'electron';
import { IpcEvents } from '../../types/ipc.types';

export const onSendSync = <K extends keyof IpcEvents>(
  channel: K,
  callback: (
    event: Electron.IpcMainEvent,
    ...args: Parameters<IpcEvents[K]>
  ) => ReturnType<IpcEvents[K]>
) => {
  ipcMain.on(channel, (event, ...args) => {
    const ret = callback(event, ...(args as any));
    event.returnValue = ret;
  });
};
