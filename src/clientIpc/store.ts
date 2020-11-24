import { PushEventMap } from './../../types/ipc.types';
import { DictUnit } from "@activejs/core";

export const optionsData = new DictUnit({
  initialValue: {
    selectedOption: undefined as PushEventMap['optionsUpdated']['options'][0] | undefined,
  }
});
