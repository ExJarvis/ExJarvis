import { DataService } from './../../types/ipc.types';
import moment from 'moment';
import { CRUDEvents } from '../../types/ipc.types';
import { DatabaseService } from '../db/database.service';
import { Clipboard } from '../db/entities/clipboard.entity';
import { webSend } from './ipc.utils';
import { Spider } from '../spider';

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

  public onCallback: CRUDEvents['serviceCRUD'] = (data) => {
    switch(data.event) {
      case 'onQuery':
        return this.onQuery(data.args);
      case 'onSelection':
        return this.onSelection(data.args);
      default:
        return 'unknown event: ' + data.event;
    }
  };

  private onSelection = (args : { text: string }) => {
    
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
            this.servicePUSH(
              {
                state: {
                  options: value?.map(el => el.title) || [],
                }
              });
          })
        } catch (e) {
          console.log({ e });
        }
      }
    }, 600);
  };

  public servicePUSH = (data: any) => {
    console.log({ data });
    webSend('servicePUSH', data, 'hostel');
  };
}
