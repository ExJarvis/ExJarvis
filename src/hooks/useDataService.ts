import { useGenState } from './useGenState';
import * as lodash from 'lodash';
import * as React from 'react';
import { sendSync, onWebSend } from '../misc/utils';
import { ClipHistory } from '../../types/ipc.types';
import useUnit from './useUnit';
import { myDict } from '../clientIpc/store';

const useDataService = () => {
  React.useEffect(() => {
    registerListener();
  }, []);

  const registerListener = () => {
    onWebSend('servicePUSH', (event, service, data) => {
      console.log({ service, data }, 'onWebSend');
    });
  };

  const sendData = (data: any) => {
    sendSync('serviceCRUD', 'hostel', data);
  };


  return {
    sendData,
  };
};

export default useDataService;
