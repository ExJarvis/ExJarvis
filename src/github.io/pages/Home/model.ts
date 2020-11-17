import React from 'react';
import { AppProps } from './types';
// import localeObj from '../../locale/zh-CN';
// import { IntlProvider } from 'react-intl';
import { enquireScreen } from 'enquire-js';
import { useGenState } from '../../../hooks/useGenState';

// let isMobileGlobal = false;
// const enquireScreen = ((b: any) => {
//   isMobileGlobal = b;
// });
// addLocaleData(localeObj.data);

const useApp = (props: AppProps) => {
  const initialState = {
    // appLocale: localeObj,
    isMobile: false, // isMobileGlobal,
  };
  const [state, setState] = useGenState(initialState);

  const { isMobile } = state;

  React.useEffect(() => {
    // handleLocale();
    handleScreen();
  }, []);

  // React.useEffect(() => {
  //   handleLocale();
  // }, [appLocale]);

  const handleLocale = () => {
    // addLocaleData(appLocale.data);
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
    // appLocale,
    isMobile,
  };
};

export default useApp;
