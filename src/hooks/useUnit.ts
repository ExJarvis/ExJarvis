import { UnitBase } from '@activejs/core';
import * as React from 'react';

type UnitValueType<T> = T extends UnitBase<infer X> ? X : never;

const useUnit = <U extends UnitBase<any>, T = UnitValueType<U>>(activeJsUnit: U) => {
  const [value, setValue] = React.useState(activeJsUnit.value() as T);

  React.useEffect(() => {
    const subscription = activeJsUnit.subscribe((value) => {
      setValue(value);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setUnitValue = (value: T) => {
    activeJsUnit.dispatch(value);
  };

  return {
    value,
    setValue: setUnitValue,
  };
};

export default useUnit;
