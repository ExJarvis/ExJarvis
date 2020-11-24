import { clipboard } from 'electron';
import moment from 'moment';
import { Repository } from 'typeorm';
import { OptionsItem, RestEndpoints, DataService, PushEventMap, OptionItem } from '../../types/ipc.types';
import { DatabaseService } from '../db/database.service';
import { Clipboard } from '../db/entities/clipboard.entity';
import { webSend } from './ipc.utils';
import * as lodash from 'lodash';
import { optionsData } from '../../src/clientIpc/store';

export class ClipboardServices implements DataService {
  private static instance: ClipboardServices;
  private current: string = '';
  private history: OptionsItem[] = [];
  private clipRepo: Repository<OptionsItem> | null = null;

  private constructor() {
    this.init();
  }

  public static getInstance(): ClipboardServices {
    if (!ClipboardServices.instance) {
      ClipboardServices.instance = new ClipboardServices();
    }
    return ClipboardServices.instance;
  }

  private init = async () => {
    const connection = await new DatabaseService().connection;
    this.clipRepo = connection.getRepository(Clipboard) as any;
    this.monitorClipboard();
  };

  public onCallback: RestEndpoints['serviceCRUD'] = (data) => {
    if(data.events.includes('onQuery')) {
      return this.onQuery(data.map['onQuery']);
    }
    if(data.events.includes('onSelection')) {
      return this.onSelection(data.map['onSelection']);
    }
  };

  private onSelection = (args? : { selectedOption: OptionItem }) => {
    if(!args) return;
    // console.log({ args });
    const { selectedOption } = args;
    clipboard.writeText(selectedOption.details);
  };

  private onQuery = (args?:  { query: string }) => {
    if(!args) return;
    // console.log({ args });
    const { query } = args;
    const rawOptions = this.history
      .filter((el) => {
        return el?.data?.value?.toLowerCase()?.includes(query?.toLowerCase());
      })
      .reverse();
    let options: any[] = lodash.uniq(rawOptions).map((el) => el?.data?.value).slice(0, 10);
    options = options.map(el => ({ summary: el, details: el }));
    optionsData.set('options', options);
  };

  // public deleteClipHistory: CRUDEvents['clip/history/DELETE'] = ({ id }) => {
    // ipcMain.on('deleteState', async (event, _item: Clipboard) => {
    //   try {
    //     const item = await clipRepo.create(_item);
    //     await clipRepo.remove(item);
    //     event.returnValue = await clipRepo.find();
    //   } catch (err) {
    //     throw err;
    //   }
    // });
  // };

  private monitorClipboard = async () => {
    const newClip = clipboard.readText();
    if (newClip !== this.current) {
      this.current = newClip;
      this.handleClipboardChange(newClip);
    }
    setTimeout(this.monitorClipboard, 100);
  };

  private handleClipboardChange = async (value: string) => {
    this.current = value;
    try {
      const item = await this.clipRepo?.create({
        data: {
          createdAt: moment().format('LLLL'),
          updatedAt: moment().format('LLLL'),
          value,
        },
      });
      if (item) {
        await this.clipRepo?.save(item);
        this.history = (await this.clipRepo?.find()) || [];
      }
      this.onQuery({ query: '' });
    } catch (err) {
      throw err;
    }
  };
}
