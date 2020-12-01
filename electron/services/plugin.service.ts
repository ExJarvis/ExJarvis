import { ClientEventMap, OptionItem, ServerEventMap, RendererEventMap } from '../../types/ipc.types';
import { Socket } from 'socket.io';
import { RendererService } from './renderer.service';
import { AppService } from './app.service';

type PluginRegistry = {
  keyword?: string;
  socket: Socket;
};

export class PluginService {
  private static instance: PluginService;
  private app?: typeof AppService.prototype;
  private ipc?: typeof RendererService.prototype;
  private alivePlugins: { [id: string]: PluginRegistry } = {};
  private activePlugin: string = '';

  private constructor() {
    this.init();
  }

  public static getInstance(): PluginService {
    if (!PluginService.instance) {
      PluginService.instance = new PluginService();
    }
    return PluginService.instance;
  }

  private init = async () => {
    this.initAppService();
    this.initIpcService();
    this.registerEvents();
  }

  private initIpcService = async () => {
    this.ipc = await RendererService.getInstance();
  }

  private initAppService = async () => {
    this.app = await AppService.getInstance();
  }

  private registerEvents = async () => {
    this.app?.io?.on('connection', async (socket: Socket) => {
      this.onConnect(socket);

      socket.on('disconnect', async () => {
        await this.onDisconnect(socket);
        // console.log({ plugins: this.alivePlugins });
      });

      socket.on('event', async (map: ServerEventMap) => {
        console.log({ event: map, plugins: this.alivePlugins });
        const response = {} as ClientEventMap;

        if (map.onRegister) {
          response.onWelcome = await this.onRegister(map.onRegister, socket);
        }

        if (map.onOptionsUpdated) {
          const options = map.onOptionsUpdated?.options;
          if (options && Array.isArray(options)) {
            await this.onOptionsUpdated(map.onOptionsUpdated);
          }
        }

        this.emitEvent(response, socket);
      });
    });
  };

  private emitEvent = (params?: ClientEventMap, socket?: Socket) => {
    if (params && Object.keys(params).length) {
      (socket || this.alivePlugins[this.activePlugin].socket)?.emit('event', params);
    }
  };

  private setActiveSocket = (id: string) => {
    this.activePlugin = id;
  };

  private onOptionsUpdated = async (args?: ServerEventMap['onOptionsUpdated']) => {
    this.ipc?.doUpdateOptions(args);
  };

  private onRegister = async (
    args: ServerEventMap['onRegister'],
    socket: Socket
  ): Promise<ClientEventMap['onWelcome']> => {
    this.alivePlugins[socket.id] = {
      // ...this.alivePlugins[socket.id],
      socket,
      keyword: args?.keyword,
    };

    const message: string[] = [];
    message.push(`Welcome ${socket.handshake.address}`);
    args?.keyword && message.push(`Your keyword '${args.keyword}' has been registered!`);
    // console.log({ message });
    return {
      status: 'SUCCEEDED',
      message: message.join('\n'),
    };
  };

  private onConnect = async (socket: Socket) => {
    // this.alivePlugins[socket.id] = {
    //   socket,
    // };
    if (!this.activePlugin) {
      this.setActiveSocket(socket.id);
    }
    console.log('a user connected: ' + socket.handshake.address);
  };

  private onDisconnect = async (socket: Socket) => {
    delete this.alivePlugins[socket.id];
    console.log('a user disconnected: ' + socket.handshake.address);
  }

  public doQuery = async (args: ClientEventMap['onQuery']) => {
    this.emitEvent({ onQuery: args });
  }

  public doSelection = (args: ClientEventMap['onSelection']) => {
    this.emitEvent({ onSelection: args });
  }
}
