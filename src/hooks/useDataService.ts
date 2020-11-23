import { useGenState } from './useGenState';
import * as lodash from 'lodash';
import * as React from 'react';
import { sendSync, onWebSend } from '../misc/utils';
import { OptionsItem } from '../../types/ipc.types';
import useUnit from './useUnit';
import { myDict } from '../clientIpc/store';

const useDataService = () => {
  React.useEffect(() => {
    registerListener();
  }, []);

  const registerListener = () => {
    onWebSend('servicePUSH', (event, data, service) => {
      // console.log({ service, data }, 'servicePUSH');
    });
  };

  const onQuery = (data: any): OptionsItem[] => {
    return sendSync('serviceCRUD', {
      event: 'onQuery',
      args: {},
    }, "hostel");
  };

  const onSelection = (data: any): void => {
    return sendSync('serviceCRUD', {
      event: 'onSelect',
      args: {},
    }, "hostel");
  };

  return {
    onQuery,
    onSelection,
  }
};

export default useDataService;
