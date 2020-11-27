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
    return {
      status: 'SUCCEEDED',
      message: `Welcome ${connection?.remoteAddress}:${connection?.remotePort}`,
    };
  };
}
