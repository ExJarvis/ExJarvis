import Select from 'antd/lib/select';
import React from 'react';
import { render } from 'react-dom';
import { createUseStyles } from 'react-jss';
import 'antd/dist/antd.css';
import SearchInput from './components/SearchInput';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const useStyles = createUseStyles((theme) => ({
  root: {
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const classes = useStyles();

  return <div className={classes.root}>
    <SearchInput />
  </div>;
};

render(<App />, mainElement);
