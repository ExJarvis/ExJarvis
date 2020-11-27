import express from 'express';
import { AddressInfo } from 'net';
import { PushEventMap, OptionItem, PushResponseMap } from '../types/ipc.types';
import getPort from 'get-port';
import { PluginService } from './plugin.service';
import { isValidArray } from './utils';

export const app = express();

import bodyParser from 'body-parser';
const jsonParser = bodyParser.json()
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);

app.post('/event', async (req, res) => {
  const events = req.body as PushEventMap;
  const response = {} as PushResponseMap & { error: any };

  if (!events || !Object.keys(events).length) {
    response.error = `Bad event ${JSON.stringify(events)} received from the app!`;
  }

  if (events.onOptionsUpdated) {
    const options = events.onOptionsUpdated?.options;
    if (options && Array.isArray(options)) {
      response.onOptionsUpdated = await PluginService.getInstance().onOptionsUpdated(
        events.onOptionsUpdated
      );
    }
  }

  if (events.onHandShake) {
    response.onHandShake = await PluginService.getInstance().onHandShake(
      events.onHandShake,
      req.connection
    );
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
