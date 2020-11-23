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
    options: [] as OptionsItem[],
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
    const ret = options
      .filter((el) => {
        return el?.data?.value?.toLowerCase()?.includes(query?.toLowerCase());
      })
      .reverse();
    return lodash.uniq(ret).map((el) => el?.data?.value);
  };

  return {
    options,
    onSelection,
    onQuery,
  };
};

export default useService;
