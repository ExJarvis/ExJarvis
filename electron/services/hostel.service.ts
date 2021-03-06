import { optionsData } from '../../src/clientIpc/store';
import { OptionItem, RestEndpoints } from '../../types/ipc.types';
import { Spider } from '../spider';
import { DataService, DataServiceDTO } from '../../types/ipc.types';
import { webSend } from './ipc.utils';

export class HostelService implements DataService {
  private static instance: HostelService;
  private queryTimeout: any;
  private spider?: ReturnType<typeof Spider.getInstance>;

  private constructor() {
    this.init();
  }

  public static getInstance(): HostelService {
    if (!HostelService.instance) {
      HostelService.instance = new HostelService();
    }
    return HostelService.instance;
  }

  private init = async () => {
    this.spider = Spider.getInstance() as any;
  };

  public onCallback: RestEndpoints['serviceCRUD'] = (data) => {
    if (data.events.includes('onQuery')) {
      return this.onQuery(data.map['onQuery']);
    }
    if (data.events.includes('onSelection')) {
      return this.onSelection(data.map['onSelection']);
    }
  };

  private onSelection = async (args?: { option: OptionItem }) => {
    if (!args) return;
    // open(args.selectedOption.details);
    const { option } = args;
    // console.log({ selectedOption });
    const page = await this.spider?.getReadablePage(option.details);
    // console.log(page?.content);
    // console.log(optionsData.get('options'));
    // optionsData.set('options', [{
    //   summary: selectedOption.summary,
    //   details: page.content,
    // }]);
    const newOptions =
      optionsData?.get('options')?.map((el: OptionItem) => {
        // console.log(el.details === selectedOption.details);
        return {
          summary: el.summary,
          details: el.details === option.details && page ? page : el.details,
        };
      }) || [];
    // console.log({ newOptions });
    optionsData.set('options', newOptions);
    // console.log(page);
  };

  private onQuery = (args?: { query: string }) => {
    if (!args) return;
    const { query } = args;
    optionsData.dispatch({
      options: [{
        summary: query ? `Searching for '${query}' ...` : 'Start typing to search',
        details: query ? 'Sit back and relax, results are coming! :)' : `It'll be quick, promise!`,
      }],
    });
    if (this.queryTimeout) {
      clearTimeout(this.queryTimeout);
    }
    this.queryTimeout = setTimeout(() => {
      if (query) {
        try {
          const results = this.spider?.search({ query });
          results?.then((value) => {
            optionsData.dispatch({
              options:
                value?.map((el) => ({
                  summary: el.title,
                  details: el.link,
                })) || [],
            });
          });
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
