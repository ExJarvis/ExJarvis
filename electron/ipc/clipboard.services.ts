import { clipboard } from 'electron';
import moment from 'moment';
import { Repository } from 'typeorm';
import { OptionsItem, CRUDEvents } from '../../types/ipc.types';
import { DatabaseService } from '../db/database.service';
import { Clipboard } from '../db/entities/clipboard.entity';
import { webSend } from './ipc.utils';

export class ClipboardServices {
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

  public onSelection: CRUDEvents['clip/current/POST'] = ({ text }) => {
    clipboard.writeText(text);
  };

  public onQuery: CRUDEvents['clip/history/GET'] = () => {
    return {
      options: this.history,
    };
  };

  public deleteClipHistory: CRUDEvents['clip/history/DELETE'] = ({ id }) => {
    // ipcMain.on('deleteState', async (event, _item: Clipboard) => {
    //   try {
    //     const item = await clipRepo.create(_item);
    //     await clipRepo.remove(item);
    //     event.returnValue = await clipRepo.find();
    //   } catch (err) {
    //     throw err;
    //   }
    // });
  };

  public pushClipHistory = () => {
    webSend('servicePUSH', {
      state: {
        options: this.history,
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
