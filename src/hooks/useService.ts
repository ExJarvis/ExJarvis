import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as lodash from 'lodash';
import * as React from 'react';
import { sendSync, onWebSend } from '../misc/utils';
import { OptionsItem, DataServiceName } from '../../types/ipc.types';
import useUnit from './useUnit';
import { myDict } from '../clientIpc/store';

const useService = ({
  serviceName,
} : {
  serviceName: DataServiceName;
}) => {
  const initialState = {
    options: [] as string[],
  };
  const [state, setState] = useGenState(initialState);
  const { options } = state;
  const store = useUnit(myDict);

  React.useEffect(() => {
    registerListener();
  }, []);

  const registerListener = () => {
    onWebSend('servicePUSH', (event, ipcState, service) => {
      console.log(ipcState, service);
      onOptionsUpdated(ipcState.state);
    });
  };

  const onOptionsUpdated = (ipcState: {
    options: typeof initialState.options;
  }) => {
    setState(ipcState);
  };

  const onSelection = (val: string) => {
    store.setValue({ a: val });
    sendSync('serviceCRUD', {
      event: 'onSelection',
      args: { text: val },
    }, serviceName);
  };

  const onQuery = (query: string) => {
    const options = sendSync('serviceCRUD', {
      event: 'onQuery',
      args: { query },
    }, serviceName);
    // // console.log({ options });
    // options && onOptionsUpdated({ options });
    // return options;
  };

  console.log({ options });
  return {
    options,
    onSelection,
    onQuery,
  };
};

export default useService;
