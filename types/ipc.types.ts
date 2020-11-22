export type ClipHistory = {
  id: number;
  data: {
    createdAt: string;
    updatedAt: string;
    value: string;
  };
};

export type ClipState = {
  current: string;
  history: ClipHistory[];
};

export type DataServiceName = 'clipboard' | 'hostel';

export interface DataService {

}

export type CRUDEvents = {
  'clip/current/POST': (args: { text: string }) => void;
  'clip/current/GET': () => string;
  'clip/current/PUT': (args: { text: string }) => void;
  'clip/current/DELETE': () => void;
  'clip/history/GET': () => ClipState;
  'clip/history/DELETE': (args: { id: number }) => void;
  'serviceCRUD': (service: DataServiceName, data: any ) => void;
};

export type PushEvents = {
  'clip/history/PUSH': (args: { state: ClipState }) => void;
  'servicePUSH': (service: DataServiceName, data: any) => void;
};
