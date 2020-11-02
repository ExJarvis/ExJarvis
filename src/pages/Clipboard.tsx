/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import Select from 'antd/lib/select';
import { useGenState } from '../hooks/useGenState';
import { createUseStyles } from 'react-jss';
import SearchInput from '../components/SearchInput';
import useClipboard from '../hooks/useClipboard';

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
  };

  const [state, setState] = useGenState<typeof initialState>(initialState);
  const classes = useStyles();
  const { history, current, write } = useClipboard();

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
