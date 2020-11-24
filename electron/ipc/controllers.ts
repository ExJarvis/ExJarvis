import { ClipboardServices } from './clipboard.services';
import { onSendSync } from './ipc.utils';
import { DataServiceName, DataService } from '../../types/ipc.types';
import { HostelServices } from './hostel.services';
import { CommonServices } from './common.services';
import { registeredService } from '../../src/clientIpc/store';

export const registerControllers = async () => {
  const services = {
    common: CommonServices.getInstance(),
    clipboard: ClipboardServices.getInstance(),
    hostel: HostelServices.getInstance(),
  } as { [K in DataServiceName]: DataService };

  onSendSync('serviceCRUD', (event, data, service) => {
    // console.log({ data, service, s: services[service] });
    if(registeredService.value() !== service) {
      registeredService.dispatch(service);
    }
    return services[service].onCallback(data, service);
  });
};
