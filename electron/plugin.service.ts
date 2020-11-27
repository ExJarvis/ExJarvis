import { PushResponseMap, OptionItem, PushEventMap } from '../types/ipc.types';
import { Socket } from 'net';

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

  public onOptionsUpdated = async (
    args?: PushEventMap['onOptionsUpdated']
  ): Promise<PushResponseMap['onOptionsUpdated']> => {
    return {};
  };

  public onHandShake = async (
    args: PushEventMap['onHandShake'],
    connection: Socket
  ): Promise<PushResponseMap['onHandShake']> => {
    const message: string[] = [];
    message.push(`Welcome ${connection?.remoteAddress}:${args?.port}`);
    args?.keyword && message.push(`Your keyword '${args.keyword}' has been registered!`);
    console.log({ message });
    return {
      status: 'SUCCEEDED',
      message: message.join('\n'),
    };
  };
}
