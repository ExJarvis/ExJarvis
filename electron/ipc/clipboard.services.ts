import { clipboard } from 'electron';
import moment from 'moment';
import { Repository } from 'typeorm';
import { OptionsItem, CRUDEvents, DataService } from '../../types/ipc.types';
import { DatabaseService } from '../db/database.service';
import { Clipboard } from '../db/entities/clipboard.entity';
import { webSend } from './ipc.utils';
import * as lodash from 'lodash';

export class ClipboardServices implements DataService {
  private static instance: ClipboardServices;
  private current: string = '';
  private history: OptionsItem[] = [];
  private clipRepo: Repository<OptionsItem> | null = null;

  private constructor() {
    // this.init();
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
    // console.log({ args });
    const { text } = args;
    clipboard.writeText(text);
  };

  private onQuery = (args:  { query: string }) => {
    // console.log({ args });
    const { query } = args;
    const rawOptions = this.history
      .filter((el) => {
        return el?.data?.value?.toLowerCase()?.includes(query?.toLowerCase());
      })
      .reverse();
    const options = lodash.uniq(rawOptions).map((el) => el?.data?.value).slice(0, 10);
    return options;
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

  public pushClipHistory = () => {
    webSend('servicePUSH', {
      state: {
        options: this.onQuery({ query: '' }),
      },
    }, 'clipboard');
  };

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
      this.pushClipHistory();
    } catch (err) {
      throw err;
    }
  };
}
