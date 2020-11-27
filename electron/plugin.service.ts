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
    return socket.emit('event', params); 
  };

  public onOptionsUpdated = async (
    args?: ServerEventMap['onOptionsUpdated']
  ): Promise<ClientEventMap['onOptionsUpdated']> => {
    return {};
  };

  public onHandShake = async (
    args: ServerEventMap['onHandShake'],
    address: string,
  ): Promise<ClientEventMap['onHandShake']> => {
    const message: string[] = [];
    message.push(`Welcome ${address}`);
    args?.keyword && message.push(`Your keyword '${args.keyword}' has been registered!`);
    console.log({ message });
    return {
      status: 'SUCCEEDED',
      message: message.join('\n'),
    };
  };
}
