export type ClipHistory = {
  id: number;
  data: {
    createdAt: string;
    updatedAt: string;
    value: string;
  };
};

export type IpcEvents = {
  writeText: (text: string) => void;
  readState: () => {
    current: string;
    history: ClipHistory[];
  };
};
