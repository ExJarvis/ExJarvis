import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as React from 'react';

const useClipboard = () => {
  const initialState = {
    current: '',
    history: [] as string[],
  };
  const [state, setState] = useGenState(initialState);
  const {
    current,
    history,
  } = state;

  React.useEffect(() => {
    monitorClipboard();
  }, []);

  const monitorClipboard = () => {
    // const next = ipcRenderer.sendSync('readText', '');
    const ipcState = ipcRenderer.sendSync('readState', '');
    if (ipcState.current !== current) {
      handleClipboardChange(ipcState);
    }
    setTimeout(monitorClipboard, 100);
  };

  const handleClipboardChange = (ipcState: {
    current: string;
    history: string[];
  }) => {
    setState(ipcState);
  };

  const write = (val: string) => {
    ipcRenderer.sendSync('writeText', val);
  };

  return {
    current,
    history,
    write,
  };
};

export default useClipboard;
