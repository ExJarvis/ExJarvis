/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import Select from 'antd/lib/select';
import { useGenState } from '../hooks/useGenState';
import { createUseStyles } from 'react-jss';
import SearchInput from '../components/SearchInput';
import useClipboard from '../hooks/useClipboard';
import useKeypress from '../hooks/useKeypress';
import { Key } from 'ts-keycode-enum';

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
    cursor: 'pointer',
  },
  details: {
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
  highlighted: {
    background: 'yellow',
  },
}));

interface ClipboardProps {}

const Clipboard: React.FC<ClipboardProps> = () => {
  const initialState = {
    highlightedIdx: 0,
  };

  const [state, setState] = useGenState<typeof initialState>(initialState);
  const classes = useStyles();
  const { history, current, write } = useClipboard();
  const isDownPressed = useKeypress([Key.DownArrow]);
  const isUpPressed = useKeypress([Key.UpArrow]);
  const isEnterPressed = useKeypress([Key.Enter]);

  const { highlightedIdx } = state;

  React.useEffect(() => {
    if(isUpPressed && highlightedIdx) {
      setState({
        highlightedIdx: highlightedIdx - 1,
      });
    }
    if(isDownPressed && highlightedIdx < history.length - 1) {
      setState({
        highlightedIdx: highlightedIdx + 1,
      });
    }
    if(isEnterPressed) {
      write(history[highlightedIdx]);
    }
  }, [isDownPressed, isUpPressed, isEnterPressed]);

  const handleSelect = (highlightedIdx: number) => {
    setState({ highlightedIdx });
  };

  const renderHistory = () => {
    return (
      <div className={classes.history}>
        {history?.map((el, idx) => (
          <span
            onClick={() => handleSelect(idx)}
            className={`${classes.ellipsis} ${highlightedIdx === idx ? classes.highlighted : ''}`}
          >
            {el}
          </span>
        ))}
      </div>
    );
  };

  const renderDetails = () => {
    return <div className={classes.details}>{history[highlightedIdx]}</div>;
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
