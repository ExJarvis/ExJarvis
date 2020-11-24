export type OptionsItem = {
  id: number;
  data: {
    createdAt: string;
    updatedAt: string;
    value: string;
  };
};

export type OptionsResponseDTO = {
  options: OptionsItem[];
};

export type DataServiceName = 'clipboard' | 'hostel';

// export type EntityType = string; // TODO

// export interface DataType <K extends keyof DataService> {
//   event: K;
//   args: Parameters<DataService[K]>
// };
export interface DataService {
  onCallback: RestEndpoints['serviceCRUD'];
}

// export type Datas = {
//   event: 'onQuery',
//   args: { query: string },
//   returns: EntityType[],
// } | {
//   event: 'onSelect',
//   args: { item: EntityType },
//   returns: void,
// };

export type RestEvents = 'onQuery' | 'onSelection';

export type RestEndpoints = {
  serviceCRUD: (
    data: {
      event: RestEvents;
      args: any;
    } /* DataType<K> */,
    service: DataServiceName
  ) => any;
};

export type PushEventMap = {
  optionsUpdated: {
    options: {
      summary: string;
      details: string;
    }[],
    extraData?: void;
  };
  somethingelse: {};
};

export type DataServiceDTO = {
  events: [keyof PushEventMap];
  map: Partial<PushEventMap>;
};

export type PushEndpoints = {
  // 'clip/history/PUSH': (args: { state: OptionsResponseDTO }) => void;
  servicePUSH: (
    data: DataServiceDTO,
    service: DataServiceName
  ) => void;
};
