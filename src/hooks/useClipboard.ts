import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as lodash from 'lodash';
import * as React from 'react';
import { sendSync, onWebSend } from '../misc/utils';
import { ClipHistory } from '../../types/ipc.types';

const useClipboard = () => {
  const initialState = {
    current: '',
    history: [] as ClipHistory[],
  };
  const [state, setState] = useGenState(initialState);
  const { current, history } = state;

  React.useEffect(() => {
    // monitorClipboard();
    handleClipboardEvent();
  }, []);

  const handleClipboardEvent = () => {
    onWebSend('clip/history/PUSH', (event, ipcState) => {
      console.log(event, ipcState);
      handleClipboardChange(ipcState.state);
    });
  };

  const monitorClipboard = () => {
    // const next = ipcRenderer.sendSync('readText', '');
    const ipcState = sendSync('clip/history/GET');
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
    sendSync('clip/current/POST', { text: val });
  };

  const filter = (query: string) => {
    const ret = history
      .filter((el) => {
        return el?.data?.value?.toLowerCase()?.includes(query?.toLowerCase());
      })
      .reverse();
    return lodash.uniq(ret).map((el) => el?.data?.value);
  };

  return {
    current,
    history,
    write,
    filter,
  };
};

export default useClipboard;
