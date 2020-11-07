import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as lodash from 'lodash';
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
    setTimeout(monitorClipboard, 300);
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

  const filter = (query: string) => {
    const ret = history
      .filter((el) => {
        return el?.toLowerCase()?.includes(query?.toLowerCase());
      })
      .reverse();
    return lodash.uniq(ret);
  };

  return {
    current,
    history,
    write,
    filter,
  };
};

export default useClipboard;
