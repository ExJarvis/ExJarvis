/* eslint-disable semi */
/* eslint-disable comma-dangle */
import { FileTextOutlined } from '@ant-design/icons';
import * as React from 'react';
import SearchInput from '../../common/SearchInput';
import useLauncher from './model';
import useStyles from './styles';
import { LauncherProps } from './types';
// import { animated } from 'react-spring';

const Launcher: React.FC<LauncherProps> = (props) => {
  const classes = useStyles();
  const {
    filteredHistory,
    historyRefs,
    highlightedIdx,
    query,
    handleSelect,
    handleSearch,
    // spring,
  } = useLauncher(props);

  const renderHistory = () => {
    return (
      <div className={`${classes.history}`}>
        {filteredHistory?.map((el, idx) => (
          <div
            ref={historyRefs[idx]}
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
    return (
      <pre className={`${classes.details}`}>
        {filteredHistory[highlightedIdx]}
      </pre>
    );
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

export default React.memo(Launcher);
