import { ClipboardServices } from './clipboard.services';
import { onSendSync } from './ipc.utils';
import { DataServiceName, DataService } from '../../types/ipc.types';
import { HostelServices } from './hostel.services';

export const registerControllers = async () => {
  const services = {
    clipboard: ClipboardServices.getInstance(),
    hostel: HostelServices.getInstance(),
  } as { [K in DataServiceName]: any /*DataService*/ };

  onSendSync('clip/current/POST', (event, args) => {
    return services.clipboard.postClipCurrent(args);
  });

  onSendSync('clip/history/GET', (event) => {
    return services.clipboard.getClipHistory();
  });

  onSendSync('clip/history/DELETE', (event) => {
    // return clipboardServices.DELETE({ id: 123 });
  });

  onSendSync('serviceCRUD', (event, data, service) => {
    return services[service].serviceCRUD(data);
  });
};
