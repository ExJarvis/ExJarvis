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

export type RestEventMap = Partial<{
  onQuery: {
    query: string;
  };
  onSelection: {
    option: OptionItem,
  };
}>;

export type RestResponseMap = Partial<{
  onQuery: {
    options?: OptionItem[],
  };
  onSelection: {
    options?: OptionItem[],
  };
}>;

export type DataServiceQueries = {
  events: [keyof RestEventMap];
  map: Partial<RestEventMap>;
};


export type RestEndpoints = {
  serviceCRUD: (
    data: DataServiceQueries,
    service: DataServiceName
  ) => any;
};

export type OptionItem = {
  summary: string;
  details: string;
};

export type RendererEventMap = Partial<{
  onOptionsUpdated: {
    options: OptionItem[],
  },
  onWelcome: {
    status: 'SUCCEEDED' | 'FAILED',
    message: string;
  },
}>;

export type MainEventMap = Partial<{
  onQuery: {
    query: string;
  };
  onSelection: {
    option: OptionItem,
  };
  onRegister: {
    keyword?: string;
  };
}>;

export type ServerEventMap = Partial<{
  onOptionsUpdated: {
    options: OptionItem[],
  },
  onRegister: {
    keyword?: string;
  },
}>;

export type ClientEventMap = Partial<{
  onQuery: {
    query: string;
  };
  onSelection: {
    option: OptionItem,
  };
  onWelcome: {
    status: 'SUCCEEDED' | 'FAILED',
    message: string;
  },
}>;

export type DataServiceDTO = {
  events: [keyof ServerEventMap];
  map: Partial<ServerEventMap>;
};

export type PushEndpoints = {
  // 'clip/history/PUSH': (args: { state: OptionsResponseDTO }) => void;
  servicePUSH: (
    data: DataServiceDTO,
    service: DataServiceName
  ) => void;
};
