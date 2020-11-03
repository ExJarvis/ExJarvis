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
    gridTemplateRows: '25px 1fr',
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
    filteredHistory: [] as string[],
    query: '',
  };

  const [state, setState] = useGenState<typeof initialState>(initialState);
  const classes = useStyles();
  const { history, current, write } = useClipboard();
  const isDownPressed = useKeypress([Key.DownArrow]);
  const isUpPressed = useKeypress([Key.UpArrow]);
  const isEnterPressed = useKeypress([Key.Enter]);

  const { highlightedIdx, query, filteredHistory } = state;

  React.useEffect(() => {
    if(isUpPressed && highlightedIdx) {
      setState({
        highlightedIdx: highlightedIdx - 1,
      });
    }
    if(isDownPressed && highlightedIdx < filteredHistory.length - 1) {
      setState({
        highlightedIdx: highlightedIdx + 1,
      });
    }
    if(isEnterPressed) {
      write(filteredHistory[highlightedIdx]);
    }
  }, [isDownPressed, isUpPressed, isEnterPressed]);

  React.useEffect(() => {
    setState({
      filteredHistory: history.filter(el => el.includes(query)),
      highlightedIdx: 0,
    });
  }, [query, history.length]);

  const handleSearch = (query: string) => {
      setState({
        query: query || '',
      });
  };

  const handleSelect = (highlightedIdx: number) => {
    setState({ highlightedIdx });
  };

  const renderHistory = () => {
    return (
      <div className={classes.history}>
        {filteredHistory?.map((el, idx) => (
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
      <SearchInput onChange={handleSearch}/>
      <div className={classes.container}>
        {renderHistory()}
        {renderDetails()}
      </div>
    </div>
  );
};

export default React.memo(Clipboard);
