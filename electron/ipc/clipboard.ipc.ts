import { Clipboard } from './../db/entities/clipboard.entity';
import { clipboard, ipcMain } from 'electron';
import { DatabaseService } from '../db/database.service';
import { Repository } from 'typeorm';
import moment from 'moment';
import { windows } from '../globals';
import { onSendSync } from './utils';
import { ClipHistory } from '../../types/ipc.types';

let current: string = '';
let history: ClipHistory[] = [];
let clipRepo: Repository<ClipHistory> | null = null;

export const registerClipboardIpc = async () => {
  const connection = await new DatabaseService().connection;
  clipRepo = connection.getRepository(Clipboard);
  onWriteText();
  // onReadText(clipRepo);
  onReadState();
  // onDeleteState(clipRepo);
  monitorClipboard();
};

const onWriteText = () => {
  onSendSync('writeText', (event, arg) => {
    clipboard.writeText(arg);
  });
};

// const onReadText = () => {
//   ipcMain.on('readText', async (event, arg) => {
//     try {
//       event.returnValue = await clipRepo.find();
//     } catch (err) {
//       throw err;
//     }
//   });
// };

const onReadState = () => {
  onSendSync('readState', (event) => {
    return {
      current,
      history,
    };
  });
};

// const onDeleteState = () => {
//   ipcMain.on('deleteState', async (event, _item: Clipboard) => {
//     try {
//       const item = await clipRepo.create(_item);
//       await clipRepo.remove(item);
//       event.returnValue = await clipRepo.find();
//     } catch (err) {
//       throw err;
//     }
//   });
// };

const monitorClipboard = () => {
  const newClip = clipboard.readText();
  if (newClip !== current) {
    current = newClip;
    handleClipboardChange(newClip);
  }
  setTimeout(monitorClipboard, 100);
};

const handleClipboardChange = async (value: string) => {
  current = value;
  try {
    const item = await clipRepo?.create({
      data: {
        createdAt: moment().format('LLLL'),
        updatedAt: moment().format('LLLL'),
        value,
      },
    });
    if (item) {
      await clipRepo?.save(item);
      history = (await clipRepo?.find()) || [];
    }
    windows?.forEach((win) =>
      win?.webContents.send('updatedState', {
        current,
        history,
      })
    );
  } catch (err) {
    throw err;
  }
};
