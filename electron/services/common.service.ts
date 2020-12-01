import { DataServiceName } from '../../types/ipc.types';
import { optionsData, registeredService } from '../../src/clientIpc/store';
import { webSend } from './ipc.utils';
import { DataServiceDTO, DataService } from '../../types/ipc.types';

export class CommonService {
  private static instance: CommonService;

  private constructor() {
    this.init();
  }

  public static getInstance(): CommonService {
    if (!CommonService.instance) {
      CommonService.instance = new CommonService();
    }
    return CommonService.instance;
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
          events: ['onOptionsUpdated'],
          map: {
            onOptionsUpdated: {
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
