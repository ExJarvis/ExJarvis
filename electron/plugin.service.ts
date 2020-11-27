import { ClientEventMap, OptionItem, ServerEventMap } from '../types/ipc.types';
import { Socket } from 'socket.io';

type PluginSocket = {
  keyword?: string;
  socket: Socket,
};

export class PluginService {
  private static instance: PluginService;
  public alivePlugins: { [id: string] : PluginSocket} = {};
  private activeSocket: string;

  private constructor() {
    this.init();
  }

  public static getInstance(): PluginService {
    if (!PluginService.instance) {
      PluginService.instance = new PluginService();
    }
    return PluginService.instance;
  }

  private init = async () => {};

  public emitEvent = (
    socket: Socket,
    params?: ClientEventMap,
  ) => {
    return params && Object.keys(params).length && socket.emit('event', params); 
  };

  public onOptionsUpdated = async (
    args?: ServerEventMap['onOptionsUpdated']
  ) => {
  };

  public onRegister = async (
    args: ServerEventMap['onRegister'],
    socket: Socket,
  ): Promise<ClientEventMap['onWelcome']> => {
    this.alivePlugins[socket.id] = {
      ...this.alivePlugins[socket.id],
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

  public onConnect = async (
    socket: Socket,
  ) => {
    this.alivePlugins[socket.id] = {
      socket,
    };
    console.log('a user connected: ' + socket.handshake.address);
  };

  public onDisconnect = async (
    socket: Socket,
  ) => {
    delete this.alivePlugins[socket.id];
    console.log('a user disconnected: ' + socket.handshake.address);
  };
}
