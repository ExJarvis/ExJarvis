import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { createServer, Server } from 'http';
import socketIO from 'socket.io';
import getPort from 'get-port';
import { AddressInfo } from 'net';

export class AppService {
  private static instance: AppService;
  public app?: Express;
  public http?: Server;
  public io?: socketIO.Server;
  public port?: number;

  private constructor() {
    this.init();
  }

  public static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }
    return AppService.instance;
  }

  private init = async () => {
    this.app = express();
    if (app) {
      const jsonParser = bodyParser.json();
      app.use(jsonParser);
      this.http = createServer(app);
      if (this.http) {
        this.io = new socketIO.Server(this.http);
      }
    }
    await this.runApp();
  };

  private runApp = async () => {
    const preferredPort = await getPort({
      port: [7979, 3232, 6666],
    });

    const listener = this.http?.listen(preferredPort, () => {
      return console.log(`server is listening on ${this.port}`);
    });

    this.port = (listener?.address() as AddressInfo | undefined)?.port;
  };
}
