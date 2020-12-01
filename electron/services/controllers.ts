import { ClipboardService } from './clipboard.service';
import { onSendSync } from './ipc.utils';
import { DataServiceName, DataService } from '../../types/ipc.types';
import { HostelService } from './hostel.service';
import { CommonService } from './common.service';
import { registeredService } from '../../src/clientIpc/store';

export const registerControllers = async () => {
  const services = {
    common: CommonService.getInstance(),
    clipboard: ClipboardService.getInstance(),
    hostel: HostelService.getInstance(),
  } as { [K in DataServiceName]: DataService };

  onSendSync('serviceCRUD', (event, data, service) => {
    console.log({ data, service });
    if(registeredService.value() !== service) {
      registeredService.dispatch(service);
    }
    return services[service].onCallback(data, service);
  });
};
