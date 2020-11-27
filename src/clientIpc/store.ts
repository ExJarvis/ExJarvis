import { ServerEventMap, DataServiceName } from './../../types/ipc.types';
import { DictUnit, StringUnit } from "@activejs/core";

export const optionsData = new DictUnit({
  initialValue: {
    options: [] as ServerEventMap['optionsUpdated']['options'],
  }
});

export const registeredService = new StringUnit({
  initialValue: 'clipboard' as DataServiceName,
});
