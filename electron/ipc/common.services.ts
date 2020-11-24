import { DataServiceName } from './../../types/ipc.types';
import { optionsData, registeredService } from '../../src/clientIpc/store';
import { webSend } from './ipc.utils';
import { DataServiceDTO, DataService } from '../../types/ipc.types';

export class CommonServices {
  private static instance: CommonServices;

  private constructor() {
    this.init();
  }

  public static getInstance(): CommonServices {
    if (!CommonServices.instance) {
      CommonServices.instance = new CommonServices();
    }
    return CommonServices.instance;
  }

  private init = async () => {
    this.registerPush();
  };

  private registerPush = () => {
    optionsData.subscribe((value) => {
      const { options } = value;
      // console.log({ options });
      if (!options) return;
      this.servicePUSH(
        {
          events: ['optionsUpdated'],
          map: {
            optionsUpdated: {
              options,
            },
          },
        }
      );
    });
  };

  public servicePUSH = (data: DataServiceDTO, service: DataServiceName = registeredService.value() as any) => {
    // console.log({ data });
    webSend('servicePUSH', data, service);
  };
}
