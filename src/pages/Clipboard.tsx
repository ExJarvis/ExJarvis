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
import * as lodash from 'lodash';
import { FileTextOutlined } from '@ant-design/icons';
import useRefs from '../hooks/useRefs';
import { isElementInView } from '../utils';
import useGlobalStyles from './styles';

const useStyles = createUseStyles((theme) => ({
  outerBox: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: '25px 1fr',
    boxShadow: '2px 2px 19px 2px #0707071a',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: 600,
    // marginTop: 10,
    padding: 10,
    height: 375,
  },
  history: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    wordBreak: 'break-all',
  },
  historyItem: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '35ch',
    cursor: 'pointer',
    padding: '1px 10px',
    minHeight: 22,
  },
  details: {
    overflow: 'hidden',
    wordBreak: 'break-all',
    overflow: 'auto',
    // height: 400,
    padding: 10,
  },
  highlighted: {
    background: '#00000014',
    borderRadius: 4,
  },
  listPrefix: {
    marginRight: 5,
    color: '#0000ff78',
  }
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
  const styles = useGlobalStyles();
  const { history, current, write } = useClipboard();
  const isDownPressed = useKeypress([Key.DownArrow]);
  const isUpPressed = useKeypress([Key.UpArrow]);
  const isEnterPressed = useKeypress([Key.Enter]);
  const { refs } = useRefs<any>(state.highlightedIdx);

  const { highlightedIdx, query, filteredHistory } = state;

  React.useEffect(() => {
    if (isUpPressed && highlightedIdx) {
      setState({
        highlightedIdx: highlightedIdx - 1,
      });
    }
    if (isDownPressed && highlightedIdx < filteredHistory.length - 1) {
      setState({
        highlightedIdx: highlightedIdx + 1,
      });
    }
    if (isEnterPressed) {
      write(filteredHistory[highlightedIdx]);
    }
  }, [isDownPressed, isUpPressed, isEnterPressed]);

  React.useEffect(() => {
    const el = refs[highlightedIdx]?.current;
    if(el) {
      if(!isElementInView(el)) {
        refs[highlightedIdx]?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIdx]);

  React.useEffect(() => {
    setState({
      filteredHistory: getFilteredHistory(),
      highlightedIdx: 0,
    });
  }, [query, history.length]);

  const getFilteredHistory = () => {
    const ret = history.filter((el) => {
      return el?.toLowerCase()?.includes(query?.toLowerCase());
    }).reverse();
    return lodash.uniq(ret);
  };

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
      <div className={`${classes.history} ${styles.scrollbar}`}>
        {filteredHistory?.map((el, idx) => (
          <div
            ref={refs[idx]}
            onClick={() => handleSelect(idx)}
            className={`${classes.historyItem} ${
              highlightedIdx === idx ? classes.highlighted : ''
            }`}
          >
            <FileTextOutlined className={classes.listPrefix} />
            {el}
          </div>
        ))}
      </div>
    );
  };

  const renderDetails = () => {
    return <pre className={`${classes.details} ${styles.scrollbar}`}>
      {filteredHistory[highlightedIdx]}
    </pre>;
  };

  return (
    <div className={classes.outerBox}>
      <SearchInput onChange={handleSearch} value={query}/>
      <div className={classes.container}>
        {renderHistory()}
        {renderDetails()}
      </div>
    </div>
  );
};

export default React.memo(Clipboard);
