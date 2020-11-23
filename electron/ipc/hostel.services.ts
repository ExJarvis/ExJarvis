import moment from 'moment';
import { CRUDEvents } from '../../types/ipc.types';
import { DatabaseService } from '../db/database.service';
import { Clipboard } from '../db/entities/clipboard.entity';
import { webSend } from './ipc.utils';

export class HostelServices {
  private static instance: HostelServices;

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
  };

  public serviceCRUD: CRUDEvents['serviceCRUD'] = (data) => {
    console.log({ data }, 'onServiceCRUD');
    return { data: 'some data' };
  };

  public servicePUSH = () => {
    webSend('servicePUSH', {}, 'hostel');
  };
}
