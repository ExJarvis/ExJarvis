import { UnitBase } from '@activejs/core';
import * as React from 'react';
import { useGenState } from './useGenState';

const useUnit = <T, U extends UnitBase<T>>(activeJsUnit: U) => {
  const [unit, setUnit] = useGenState(activeJsUnit.value());

  React.useEffect(() => {
    activeJsUnit.subscribe(value => {
      setUnit(value);
    });
  }, []);

  const setValue = (value: T) => {
    value && activeJsUnit.dispatch(value)
  };

  return {
    value: unit,
    setValue,
  };
};

export default useUnit;
