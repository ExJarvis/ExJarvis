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

const useLauncher = (props: LauncherProps) => {
  const initialState = {
    highlightedIdx: 0,
    filteredHistory: [] as string[],
    query: '',
  };

  const [state, setState] = useGenState(initialState);
  const { history, filter, write } = useClipboard();
  const isDownPressed = useKeypress([Key.DownArrow]);
  const isUpPressed = useKeypress([Key.UpArrow]);
  const isEnterPressed = useKeypress([Key.Enter]);
  const { refs: historyRefs } = useRefs<any>(state.highlightedIdx);

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
    const el = historyRefs[highlightedIdx]?.current;
    if (el) {
      if (!isElementInView(el)) {
        historyRefs[highlightedIdx]?.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIdx]);

  React.useEffect(() => {
    setState({
      filteredHistory: filter(query),
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

  return {
    filteredHistory,
    historyRefs,
    highlightedIdx,
    query,
    handleSelect,
    handleSearch,
  };
};

export default useLauncher;
