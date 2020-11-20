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

export type ToMainEvents = {
  writeText: (text: string) => void;
  readState: () => ClipState;
};

export type ToRendererEvents = {
  updatedState: (state: ClipState) => void;
};
