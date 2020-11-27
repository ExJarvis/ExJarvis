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
  console.log('a user connected: ' + socket.handshake.address);

  socket.on('disconnect', () => {
    console.log('a user disconnected: ' + socket.handshake.address);
  });

  socket.on('event', async (map: ServerEventMap) => {
    console.log({ map });
    const plugin = await PluginService.getInstance();
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
