import { ClipboardServices } from './clipboard.services';
import { onSendSync } from './ipc.utils';
import { DataServiceName, DataService } from '../../types/ipc.types';
import { HostelServices } from './hostel.services';

export const registerControllers = async () => {
  const services = {
    clipboard: ClipboardServices.getInstance(),
    hostel: HostelServices.getInstance(),
  } as { [K in DataServiceName]: DataService };

  onSendSync('serviceCRUD', (event, data, service) => {
    console.log({ data });
    return services[service].onCallback(data, service);
  });
};
