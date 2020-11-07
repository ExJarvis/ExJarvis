import 'antd/dist/antd.css';
import React from 'react';
import Launcher from '../Launcher/view';
import useApp from './model';
import useStyles from './styles';
import { AppProps } from './types';

const App: React.FC<AppProps> = (props) => {
  const classes = useStyles();
  const {} = useApp(props);

  return <div className={classes.root}>
    <Launcher />
  </div>;
};

export default App;
