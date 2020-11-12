import { Clipboard } from './../db/entities/clipboard.entity';
import { clipboard, ipcMain } from 'electron';
import { DatabaseService } from '../db/database.service';
import { Repository } from 'typeorm';
import moment from 'moment';

let current: string = "";
let history: Clipboard[] = [];
let clipRepo: Repository<Clipboard> | null = null;

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
  ipcMain.on('writeText', async (event, arg) => {
    event.returnValue = clipboard.writeText(arg);
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
  ipcMain.on('readState', async (event, arg) => {
    try {
      event.returnValue = {
        current,
        history,
      };
    } catch (err) {
      throw err;
    }
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
  setTimeout(monitorClipboard, 100)
};

const handleClipboardChange = async (value: string, ) => {
  current = value;
  try {
    const item = await clipRepo?.create({
      data: {
        createdAt: moment().format('LLLL'),
        updatedAt: moment().format('LLLL'),
        value,
      }
    });
    if(item) {
      await clipRepo?.save(item);
      history = await clipRepo?.find() || [];
    }
  } catch (err) {
    throw err;
  }
};
