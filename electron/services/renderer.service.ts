import { RendererEventMap } from '../../types/ipc.types';
import { MainEventMap } from '../../types/ipc.types';
import { Socket } from 'socket.io';
import { PluginService } from './plugin.service';
import { AppService } from './app.service';

type PluginRegistry = {
  keyword?: string;
  socket: Socket;
};

export class RendererService {
  private static instance: RendererService;
  private app?: typeof AppService.prototype;
  private plugin?: typeof PluginService.prototype;
  public aliveRenderers: { [id: string]: PluginRegistry } = {};
  public activeRenderer: string = '';

  private constructor() {
    this.init();
  }

  public static getInstance(): RendererService {
    if (!RendererService.instance) {
      RendererService.instance = new RendererService();
    }
    return RendererService.instance;
  }

  private init = async () => {
    this.initAppService();
    this.initPluginService();
    this.registerEvents();
  };

  private initPluginService = async () => {
    this.plugin = await PluginService.getInstance();
  };

  private initAppService = async () => {
    this.app = await AppService.getInstance();
  };

  private registerEvents = async () => {
    this.app?.io?.on('connection', async (socket: Socket) => {
      this.onConnect(socket);
      socket.on('disconnect', async () => {
        await this.onDisconnect(socket);
        // console.log({ plugins: this.alivePlugins });
      });

      socket.on('event', async (map: MainEventMap) => {
        console.log({ event: map, plugins: this.aliveRenderers });
        const response = {} as RendererEventMap;

        if (map.onRegister) {
          response.onWelcome = await this.onRegister(map.onRegister, socket);
        }

        if (map.onQuery) {
          await this.onQuery(map.onQuery);
        }

        if (map.onSelection) {
          await this.onSelection(map.onSelection);
        }

        this.emitEvent(response, socket);
      });
    });
  };

  public emitEvent = (params?: RendererEventMap, socket?: Socket) => {
    if (params && Object.keys(params).length) {
      (socket || this.aliveRenderers[this.activeRenderer].socket)?.emit('event', params);
    }
  };

  public setActiveSocket = (id: string) => {
    this.activeRenderer = id;
  };

  private onConnect = async (socket: Socket) => {
    // this.aliveRenderers[socket.id] = {
    //   socket,
    // };
    if (!this.activeRenderer) {
      this.setActiveSocket(socket.id);
    }
    console.log('a user connected: ' + socket.handshake.address);
  };

  private onRegister = async (
    args: MainEventMap['onRegister'],
    socket: Socket
  ): Promise<RendererEventMap['onWelcome']> => {
    this.aliveRenderers[socket.id] = {
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

  private onDisconnect = async (socket: Socket) => {
    delete this.aliveRenderers[socket.id];
    console.log('a user disconnected: ' + socket.handshake.address);
  };

  public onQuery = async (args: MainEventMap['onQuery']) => {
    return this.plugin?.doQuery(args);
  };

  public onSelection = (args: MainEventMap['onSelection']) => {
    return this.plugin?.doSelection(args);
  };

  public doUpdateOptions = async (args?: RendererEventMap['onOptionsUpdated']) => {
    this.emitEvent({
      onOptionsUpdated: args,
    });
  };
}
