import bodyParser from 'body-parser';
import express from 'express';
import getPort from 'get-port';
import { AddressInfo } from 'net';
import { ServerEventMap, ClientEventMap } from '../types/ipc.types';
import { PluginService } from './plugin.service';
import { createServer } from 'http';
import socketIO, { Socket } from 'socket.io';

export const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);
const http = createServer(app);
const io = new socketIO.Server(http);

io.on('connection', async (socket: Socket) => {
  const plugin = await PluginService.getInstance();
  plugin.onConnect(socket);

  socket.on('disconnect', async () => {
    await plugin.onDisconnect(socket);
  });

  socket.on('event', async (map: ServerEventMap) => {
    console.log({ map });
    const response = {} as ClientEventMap;

    if (map.onRegister) {
      response.onWelcome = await plugin.onRegister(
        map.onRegister,
        socket.handshake.address
      );
    }

    if (map.onOptionsUpdated) {
      const options = map.onOptionsUpdated?.options;
      if (options && Array.isArray(options)) {
        await plugin.onOptionsUpdated(
          map.onOptionsUpdated
        );
      }
    }

    plugin.emitEvent(socket, response);
  });
});

export const runPluginApp = async () => {
  const preferredPort = await getPort({
    port: [7979, 3232, 6666],
  });

  const listener = http.listen(preferredPort, () => {
    return console.log(`server is listening on ${port}`);
  });

  const port = (listener.address() as AddressInfo)?.port;
};
