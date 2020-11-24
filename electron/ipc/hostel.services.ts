import open from 'open';
import { RestEndpoints } from '../../types/ipc.types';
import { Spider } from '../spider';
import { DataService, DataServiceDTO, PushEventMap } from './../../types/ipc.types';
import { webSend } from './ipc.utils';
import { optionsData } from '../../src/clientIpc/store';

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

    this.registerPush();
  };

  private registerPush = () => {
    optionsData.subscribe(value => {
      const { options } = value;
      if(!options) return;
      this.servicePUSH({
        events: ['optionsUpdated'],
        map: {
          optionsUpdated: {
            options,
          }
        },
      });
    });
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

  private onSelection = async (args : { selectedOption: PushEventMap['optionsUpdated']['options'][0] }) => {
    // open(args.selectedOption.details);
    const { selectedOption } = args;
    // console.log({ selectedOption });
    const page = await this.spider?.getReadablePage(selectedOption.details);
    // console.log(page?.content);
    // console.log(optionsData.get('options'));
    // optionsData.set('options', [{
    //   summary: selectedOption.summary,
    //   details: page.content,
    // }]);
    const newOptions = optionsData.get('options')?.map(el => {
      // console.log(el.details === selectedOption.details);
      return {
        summary: el.summary,
        details: el.details === selectedOption.details ? page?.content : el.details,
      }
    }) || [];
    // console.log({ newOptions });
    optionsData.set('options', newOptions);
    // console.log(page);
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
            optionsData.dispatch({
              options: value?.map(el => ({
                summary: el.title,
                details: el.link,
              })) || [],
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
