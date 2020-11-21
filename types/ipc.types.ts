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

export type CRUDEvents = {
  'clip/current/POST': (args: { text: string }) => void;
  'clip/current/GET': () => string;
  'clip/current/PUT': (args: { text: string }) => void;
  'clip/current/DELETE': () => void;
  'clip/history/GET': () => ClipState;
  'clip/history/DELETE': (args: { id: number }) => void;
};

export type PushEvents = {
  'clip/history/PUSH': (args: { state: ClipState }) => void;
};
