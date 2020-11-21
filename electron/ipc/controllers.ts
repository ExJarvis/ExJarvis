import { ClipboardServices } from './clipboard.services';
import { onSendSync } from './ipc.utils';

export const registerControllers = async () => {
  const clipboardServices = ClipboardServices.getInstance();

  onSendSync('clip/current/POST', (event, args) => {
    return clipboardServices.postClipCurrent(args);
  });

  onSendSync('clip/history/GET', (event) => {
    return clipboardServices.getClipHistory();
  });

  onSendSync('clip/history/DELETE', (event) => {
    // return clipboardServices.DELETE({ id: 123 });
  });
};
