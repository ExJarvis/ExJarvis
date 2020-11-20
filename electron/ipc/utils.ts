import { ipcMain } from 'electron';
import { RendererToMainEvents, MainToRendererEvents } from '../../types/ipc.types';
import { windows } from '../globals';

export const onSendSync = <K extends keyof RendererToMainEvents>(
  channel: K,
  callback: (
    event: Electron.IpcMainEvent,
    ...args: Parameters<RendererToMainEvents[K]>
  ) => ReturnType<RendererToMainEvents[K]>
) => {
  ipcMain.on(channel, (event, ...args) => {
    const ret = callback(event, ...(args as any));
    event.returnValue = ret;
  });
};

export const webSend = <K extends keyof MainToRendererEvents>(
  channel: K,
  ...args: Parameters<MainToRendererEvents[K]>
): void => {
  windows?.forEach((win) => {
      win?.webContents.send(channel, ...args)
  });
};
