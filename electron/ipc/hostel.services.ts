import open from 'open';
import { RestEndpoints } from '../../types/ipc.types';
import { Spider } from '../spider';
import { DataService, DataServiceDTO, PushEventMap } from './../../types/ipc.types';
import { webSend } from './ipc.utils';

export class HostelServices implements DataService {
  private static instance: HostelServices;
  private queryTimeout: any;
  private spider?: ReturnType<typeof Spider.getInstance>;

  private constructor() {
    this.init();
  }

  public static getInstance(): HostelServices {
    if (!HostelServices.instance) {
      HostelServices.instance = new HostelServices();
    }
    return HostelServices.instance;
  }

  private init = async () => {
    this.spider = Spider.getInstance() as any;
  };

  public onCallback: RestEndpoints['serviceCRUD'] = (data) => {
    switch(data.event) {
      case 'onQuery':
        return this.onQuery(data.args);
      case 'onSelection':
        return this.onSelection(data.args);
      default:
        return 'unknown event: ' + data.event;
    }
  };

  private onSelection = (args : { selectedOption: PushEventMap['optionsUpdated']['options'][0] }) => {
    open(args.selectedOption.details);
  };

  private onQuery = (args:  { query: string }) => {
    const { query } = args;
    if(this.queryTimeout) {
      clearTimeout(this.queryTimeout);
    }
    this.queryTimeout = setTimeout(() => {
      if(query) {
        try {
          const results = this.spider?.search({ query });
          results?.then(value => {
            this.servicePUSH({
              events: ['optionsUpdated'],
              map: {
                optionsUpdated: {
                  options: value?.map(el => ({
                    summary: el.title,
                    details: el.link,
                  })) || [],
                }
              }
            });
          })
        } catch (e) {
          // console.log({ e });
        }
      }
    }, 600);
  };

  public servicePUSH = (data: DataServiceDTO) => {
    // console.log({ data });
    webSend('servicePUSH', data, 'hostel');
  };
}
