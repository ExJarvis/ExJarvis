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
  onCallback: CRUDEvents['serviceCRUD'];
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

export type Event = 'onQuery' | 'onSelection';

export type CRUDEvents = {
  'serviceCRUD': ( data: {
    event: Event;
    args: any;
  } /* DataType<K> */, service: DataServiceName ) => any;
};

export type PushEvents = {
  // 'clip/history/PUSH': (args: { state: OptionsResponseDTO }) => void;
  'servicePUSH': (data: any, service: DataServiceName) => void;
};
