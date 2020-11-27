import express from 'express';
import { AddressInfo } from 'net';
import { PushEventMap, OptionItem, PushResponseMap } from '../types/ipc.types';
import getPort from 'get-port';
import { PluginService } from './plugin.service';
import { isValidArray } from './utils';

export const app = express();

app.get('/event', async (req, res) => {
  const events = req.query as PushEventMap;
  const response = {} as PushResponseMap & { error: any };

  // const details = [
  //   req.connection.remoteAddress,
  //   req.connection.remotePort,
  //   req.connection.localAddress,
  //   req.connection.localPort,
  // ];

  // res.write(`You are ${JSON.stringify({
  //   details,
  //   events,
  // })}`);

  if (!events || !Object.keys(events).length) {
    response.error = `Bad event ${JSON.stringify(events)} received from the app!`;
  }

  if (Object.keys(events).includes('onOptionsUpdated')) {
    const options = events.onOptionsUpdated?.options;
    if (options && Array.isArray(options)) {
      response.onOptionsUpdated = await PluginService.getInstance().onOptionsUpdated({
        options,
      });
    }
  }

  if (Object.keys(events).includes('onHandShake')) {
    response.onHandShake = await PluginService.getInstance().onHandShake({
      keyword: events.onHandShake?.keyword,
    }, req.connection);
  }

  res.send(response);
});

export const runPluginApp = async () => {
  const preferredPort = await getPort({
    port: [7979, 3232, 6666],
  });
  const listener = app.listen(preferredPort, () => {
    return console.log(`server is listening on ${port}`);
  });

  const port = (listener.address() as AddressInfo)?.port;
};
