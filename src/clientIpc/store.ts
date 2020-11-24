import { PushEventMap } from './../../types/ipc.types';
import { DictUnit } from "@activejs/core";

export const optionsData = new DictUnit({
  initialValue: {
    options: undefined as PushEventMap['optionsUpdated']['options'] | undefined,
  }
});
