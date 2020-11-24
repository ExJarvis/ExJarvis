import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as lodash from 'lodash';
import * as React from 'react';
import { sendSync, onWebSend } from '../misc/utils';
import { OptionsItem, DataServiceName, PushEventMap } from '../../types/ipc.types';
import useUnit from './useUnit';
import { optionsData } from '../clientIpc/store';

const useService = ({
  serviceName,
} : {
  serviceName: DataServiceName;
}) => {
  const initialState = {
    options: [] as PushEventMap['optionsUpdated']['options'],
  };
  const [state, setState] = useGenState(initialState);
  const { options } = state;
  const store = useUnit(optionsData);

  React.useEffect(() => {
    const listener = registerListener();
    return () => {
      listener.unsubscribe();
    };
  }, [serviceName]);

  const registerListener = () => {
    const listener = onWebSend('servicePUSH', (event, data, service) => {
      if(service === serviceName) {
        if(data.events.includes('optionsUpdated')) {
          onOptionsUpdated(data.map['optionsUpdated']);
        }
      }
    });
    return listener;
  };

  const onOptionsUpdated = (data?: PushEventMap['optionsUpdated']) => {
    setState({
      options: data?.options || [],
    });
  };

  const onSelection = (selectedOption: PushEventMap['optionsUpdated']['options'][0]) => {
    store.setValue({ selectedOption });
    sendSync('serviceCRUD', {
      event: 'onSelection',
      args: { selectedOption },
    }, serviceName);
  };

  const onQuery = (query: string) => {
    // const options = sendSync('serviceCRUD', {
    sendSync('serviceCRUD', {
      event: 'onQuery',
      args: { query },
    }, serviceName);
    // // console.log({ options });
    // options && onOptionsUpdated({ options });
    // return options;
  };

  // console.log({ options });
  return {
    options,
    onSelection,
    onQuery,
  };
};

export default useService;
