/* eslint-disable semi */
/* eslint-disable comma-dangle */
import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import useService from '../../hooks/useService';
import { useGenState } from '../../hooks/useGenState';
import useKeypress from '../../hooks/useKeypress';
import useRefs from '../../hooks/useRefs';
import { isElementInView } from '../../misc/utils';
import { LauncherProps } from './types';
import useTimeout from '../../hooks/useTimeout';
import useUnit from '../../hooks/useUnit';
import { registeredService } from '../../clientIpc/store';
// import {useSpring, animated} from 'react-spring'

/**
 * Initial wait time before triggering automated scroll on key down.
 * A value lower than 100 causes performance issues.
 */
const INTERVAL = 100;
const THRESHOLD = 200;
const useLauncher = ({
}: LauncherProps) => {
  const initialState = {
    query: '',
  };

  const [highlightedIdx, setHighlightedIdx] = React.useState(0);
  const [state, setState] = useGenState(initialState);
  const serviceName = useUnit(registeredService);
  const service = useService({ serviceName: serviceName.value as any });
  const isDownPressed = useKeypress([Key.DownArrow]);
  const isUpPressed = useKeypress([Key.UpArrow]);
  const isEnterPressed = useKeypress([Key.Enter]);
  const isTabPressed = useKeypress([Key.Tab]);
  const { refs: historyRefs } = useRefs<any>(highlightedIdx);
  const delayedNavigation = useTimeout();
  const periodicNavigation = useTimeout();
  // const spring = useSpring(() => ({opacity: 1}));

  const { query } = state;

  React.useEffect(() => {
    if (isTabPressed) {
      serviceName.setValue(serviceName.value === 'clipboard' ? 'hostel' : 'clipboard' );
    }
  }, [isTabPressed]);

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
      console.log(service.options[highlightedIdx]);
      const ret = service.onSelection(service.options[highlightedIdx]);
      // console.log({ ret });
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
  }, [query, serviceName.value]);

  React.useEffect(() => {
    setHighlightedIdx(0);
  }, [service.options.length]);


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
    if(highlightedIdx < service.options.length - 1) {
      setHighlightedIdx(highlightedIdx => {
        return highlightedIdx < service.options.length - 1 ? highlightedIdx + 1 : highlightedIdx;
      });
    }
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
    service.onQuery(query);
    setHighlightedIdx(0);
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
    placeholder: serviceName.value,
    options: service.options,
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
