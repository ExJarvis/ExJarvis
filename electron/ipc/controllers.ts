import { ClipboardServices } from './clipboard.services';
import { onSendSync } from './ipc.utils';
import { DataServiceName } from '../../types/ipc.types';
import { HostelServices } from './hostel.services';

export const registerControllers = async () => {
  const services = {
    clipboard: ClipboardServices.getInstance(),
    hostel: HostelServices.getInstance(),
  } as { [K in DataServiceName]: any };

  onSendSync('serviceCRUD', (event, data, service) => {
    console.log({ data });
    switch(data.event) {
      case 'onQuery':
        return services[service].onQuery(data.args);
      case 'onSelection':
        return services[service].onSelection(data.args);
      default:
        return 'unknown event: ' + data.event;
    }
  });
};
