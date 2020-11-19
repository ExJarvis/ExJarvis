import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as lodash from 'lodash';
import * as React from 'react';

const useClipboard = () => {
  const initialState = {
    current: '',
    history: [] as {
      id: number;
      data: {
        createdAt: string;
        updatedAt: string;
        value: string;
      }
    }[],
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
    if (ipcState?.current && ipcState?.current !== current) {
      handleClipboardChange(ipcState);
    }
    setTimeout(monitorClipboard, 300);
  };

  const handleClipboardChange = (ipcState: {
    current: typeof initialState.current;
    history: typeof initialState.history;
  }) => {
    setState(ipcState);
  };

  const write = (val: string) => {
    ipcRenderer.sendSync('writeText', val);
  };

  const filter = (query: string) => {
    const ret = history
      .filter((el) => {
        return el?.data?.value?.toLowerCase()?.includes(query?.toLowerCase());
      })
      .reverse();
    return lodash.uniq(ret).map(el => el?.data?.value);
  };

  return {
    current,
    history,
    write,
    filter,
  };
};

export default useClipboard;
