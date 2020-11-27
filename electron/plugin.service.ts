import { ClientEventMap, OptionItem, ServerEventMap } from '../types/ipc.types';
import { Socket } from 'socket.io';

export class PluginService {
  private static instance: PluginService;

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
    address: string,
  ): Promise<ClientEventMap['onWelcome']> => {
    const message: string[] = [];
    message.push(`Welcome ${address}`);
    args?.keyword && message.push(`Your keyword '${args.keyword}' has been registered!`);
    console.log({ message });
    return {
      status: 'SUCCEEDED',
      message: message.join('\n'),
    };
  };

  public onConnect = async (
    socket: Socket,
  ) => {
    console.log('a user connected: ' + socket.handshake.address);
  };

  public onDisconnect = async (
    socket: Socket,
  ) => {
    console.log('a user disconnected: ' + socket.handshake.address);
  };
}
