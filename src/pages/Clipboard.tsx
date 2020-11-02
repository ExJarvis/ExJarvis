/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import Select from 'antd/lib/select';
import { useGenState } from '../hooks/useGenState';
import { createUseStyles } from 'react-jss';
import SearchInput from '../components/SearchInput';

const useStyles = createUseStyles((theme) => ({
  outerBox: {
    height: '100%',
    display: 'grid',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: 600,
    // marginTop: 10,
    padding: 10,
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '35ch',
  },
  details: {
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
}));

interface ClipboardProps {}

const Clipboard: React.FC<ClipboardProps> = () => {
  const initialState = {
    history: [
      'https://www.google.com/search?q=mac+alfred+clipboard&newwindow=1&rlz=1C1CHBF_enIN808IN808&sxsrf=ALeKk016vogGr73jFPptjiUjW1XaGN9gnw:1604302359692&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjT1IuCrOPsAhWryTgGHXs-DiMQ_AUoAnoECAUQBA&biw=1210&bih=574#imgrc=maqPlJUQB6iFhM',
      'https://www.electronjs.org/docs/api/global-shortcut#globalshortcutregisteraccelerator-callback',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
      'http://localhost:4000/',
    ],
  };

  const [state, setState] = useGenState<typeof initialState>(initialState);
  const classes = useStyles();

  const { history } = state;

  const renderHistory = () => {
    return (
      <div className={classes.history}>
        {history?.map((el) => (
          <span className={classes.ellipsis}>{el}</span>
        ))}
      </div>
    );
  };

  const renderDetails = () => {
    return <div className={classes.details}>{history[0]}</div>;
  };

  return (
    <div className={classes.outerBox}>
      <SearchInput />
      <div className={classes.container}>
        {renderHistory()}
        {renderDetails()}
      </div>
    </div>
  );
};

export default React.memo(Clipboard);
