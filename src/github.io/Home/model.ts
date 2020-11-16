import React from 'react';
import { AppProps } from "./types";
import cnLocale from '../zh-CN';
import { addLocaleData, IntlProvider } from 'react-intl';
import { enquireScreen } from 'enquire-js';
import { useGenState } from '../../hooks/useGenState';

// let isMobileGlobal = false;
// const enquireScreen = ((b: any) => {
//   isMobileGlobal = b;
// });

const useApp = (props: AppProps) => {
  const initialState = {
    appLocale: cnLocale,
    isMobile: false, // isMobileGlobal,
  };
  const [state, setState] = useGenState(initialState);

  const {
    appLocale,
    isMobile,
  } = state;

  React.useEffect(() => {
    // handleLocale();
    handleScreen();
  }, []);

  React.useEffect(() => {
    handleLocale();
  }, [appLocale]);

  const handleLocale = () => {
    addLocaleData(appLocale.data);
    // setState({
    //   appLocale,
    //   isMobile,
    // });
  };

  const handleScreen = () => {
    enquireScreen((b: any) => {
      setState({
        isMobile: !!b,
      });
    });
  };

  return {
    appLocale,
    isMobile,
  }
};

export default useApp;
