/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import useClipboard from '../../hooks/useClipboard';
import { useGenState } from '../../hooks/useGenState';
import useKeypress from '../../hooks/useKeypress';
import useRefs from '../../hooks/useRefs';
import { isElementInView } from '../../misc/utils';
import { LauncherProps } from './types';
import useTimeout from '../../hooks/useTimeout';
import useDataService from '../../hooks/useDataService';
// import {useSpring, animated} from 'react-spring'

/**
 * Initial wait time before triggering automated scroll on key down.
 * A value lower than 100 causes performance issues.
 */
const INTERVAL = 100;
const THRESHOLD = 200;
const useLauncher = (props: LauncherProps) => {
  const initialState = {
    // highlightedIdx: 0,
    filteredHistory: [] as string[],
    query: '',
  };

  const [highlightedIdx, setHighlightedIdx] = React.useState(0);
  const [state, setState] = useGenState(initialState);
  const { history, filter, write } = useClipboard();
  const service = useDataService();
  const isDownPressed = useKeypress([Key.DownArrow]);
  const isUpPressed = useKeypress([Key.UpArrow]);
  const isEnterPressed = useKeypress([Key.Enter]);
  const { refs: historyRefs } = useRefs<any>(highlightedIdx);
  const delayedNavigation = useTimeout();
  const periodicNavigation = useTimeout();
  // const spring = useSpring(() => ({opacity: 1}));

  const { query, filteredHistory } = state;

  React.useEffect(() => {
    if (isUpPressed) {
      navigateUp();
      scheduleNavigation('UP');
    } else {
      clearScheduledNavigation();
    }
  }, [isUpPressed]);

  React.useEffect(() => {
    if (isDownPressed) {
      navigateDown();
      scheduleNavigation('DOWN');
    } else {
      clearScheduledNavigation();
    }
  }, [isDownPressed]);

  React.useEffect(() => {
    if (isEnterPressed) {
      writeSelectionToClipboard();
      service.sendData('hihihaha');
    }
  }, [isEnterPressed]);

  // React.useEffect(() => {
  //   scrollInView();
  //   if(delayedNavigation.value) {
  //     navigateUp();
  //   }
  // }, [highlightedIdx]);

  React.useEffect(() => {
    refreshList();
  }, [query, history.length]);

  const scheduleNavigation = (direction: 'UP' | 'DOWN') => {
    delayedNavigation.set({
      callback: () => periodicNavigation.set({
        callback: () => {
          if(direction === 'UP') {
            navigateUp();
          }
          if(direction === 'DOWN') {
            navigateDown();
          }
          // scheduleNavigation(direction, INTERVAL);
        },
        timeout: INTERVAL,
        repeated: true,
      }),
      timeout: THRESHOLD,
    })
  };

  const clearScheduledNavigation = () => {
    delayedNavigation.clear();
    periodicNavigation.clear();
  };

  const navigateUp = () => {
    if(highlightedIdx) {
      setHighlightedIdx(highlightedIdx => {
        return highlightedIdx ? highlightedIdx - 1 : highlightedIdx;
      });
    }
  };

  const navigateDown = () => {
    if(highlightedIdx < filteredHistory.length - 1) {
      setHighlightedIdx(highlightedIdx => {
        return highlightedIdx < filteredHistory.length - 1 ? highlightedIdx + 1 : highlightedIdx;
      });
    }
  };

  const writeSelectionToClipboard = () => {
    write(filteredHistory[highlightedIdx]);
  };

  const scrollInView = () => {
    const el = historyRefs[highlightedIdx]?.current;
    if (el) {
      if (!isElementInView(el)) {
        historyRefs[highlightedIdx]?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };

  const refreshList = () => {
    setState({
      filteredHistory: filter(query),
      // highlightedIdx: 0,
    }, () => setHighlightedIdx(0));
  };

  const handleSearch = (query: string) => {
    setState({
      query: query || '',
    });
  };

  const handleSelect = (highlightedIdx: number) => {
    setHighlightedIdx(highlightedIdx)
  };

  return {
    filteredHistory,
    historyRefs,
    highlightedIdx,
    query,
    handleSelect,
    handleSearch,
    // spring: {
    //   props: spring[0],
    //   set: spring[1],
    //   // stop: spring[2],
    // },
  };
};

export default useLauncher;
