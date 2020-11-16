import 'antd/dist/antd.css';
import React from 'react';
import useApp from './model';
import useStyles from './styles';
import { AppProps } from './types';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

const App: React.FC<AppProps> = (props) => {
  const classes = useStyles();
  const {} = useApp(props);

  return <div className={classes.root}>
    <ErrorBoundary>
      Hi there.
    </ErrorBoundary>
  </div>;
};

export default App;
