import { Socket } from 'socket.io';

export class MainService {
  private static instance: MainService;

  private constructor() {
    this.init();
  }

  public static getInstance(): MainService {
    if (!MainService.instance) {
      MainService.instance = new MainService();
    }
    return MainService.instance;
  }

  private init = async () => {};
}
