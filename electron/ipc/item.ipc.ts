import { ipcMain } from 'electron';
import { DatabaseService } from '../db/database.service';
import { Item } from '../db/entities/item.entity';

export const registerItemIpc = async () => {
  console.log('here');
  let itemRepo: any;
  try {
    const connection = await new DatabaseService().connection;
    console.log({ connection });
    itemRepo = connection.getRepository(Item);
    console.log({ itemRepo });
  } catch (e) {
    console.log({
      e,
    })
  }

  try {
    const item = await itemRepo.create({
      id: 2,
      name: 'my name'
    });
    await itemRepo.save(item);
    console.log({
      added: await itemRepo.find(),
    });
  } catch (err) {
    throw err;
  }

  try {
    console.log({
      found: await itemRepo.find(),
    });
  } catch (err) {
    throw err;
  }

  ipcMain.on('get-items', async (event: any, ...args: any[]) => {
    try {
      event.returnValue = await itemRepo.find();
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('add-item', async (event: any, _item: Item) => {
    try {
      const item = await itemRepo.create(_item);
      await itemRepo.save(item);
      event.returnValue = await itemRepo.find();
    } catch (err) {
      throw err;
    }
  });

  ipcMain.on('delete-item', async (event: any, _item: Item) => {
    try {
      const item = await itemRepo.create(_item);
      await itemRepo.remove(item);
      event.returnValue = await itemRepo.find();
    } catch (err) {
      throw err;
    }
  });
};
