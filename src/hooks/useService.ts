import { useGenState } from './useGenState';
import { ipcRenderer } from 'electron';
import * as lodash from 'lodash';
import * as React from 'react';
import { sendSync, onWebSend } from '../misc/utils';
import { OptionsItem, DataServiceName, ServerEventMap, OptionItem } from '../../types/ipc.types';
import useUnit from './useUnit';
import { optionsData } from '../clientIpc/store';

const useService = ({
  serviceName,
} : {
  serviceName: DataServiceName;
}) => {
  const initialState = {
    options: [] as Exclude<ServerEventMap['onOptionsUpdated'], undefined>['options'],
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
        if(data.events.includes('onOptionsUpdated')) {
          onOptionsUpdated(data.map['onOptionsUpdated']);
        }
      }
    });
    return listener;
  };

  const onOptionsUpdated = (data?: ServerEventMap['onOptionsUpdated']) => {
    setState({
      options: data?.options || [],
    });
  };

  const onSelection = async (option: OptionItem) => {
    store.setValue({ options: [option] });
    sendSync('serviceCRUD', {
      events: ['onSelection'],
      map: {
        onSelection: {
          option,
        }
      }
    }, serviceName);
  };

  const onQuery = (query: string) => {
    // const options = sendSync('serviceCRUD', {
    sendSync('serviceCRUD', {
      events: ['onQuery'],
      map: {
        onQuery: {
          query,
        }
      }
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
