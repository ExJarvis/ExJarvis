import React from "react";

const useRefs = <T>(
  defaultNbr: number = 1,
) => {
  const [size, setSize] = React.useState(defaultNbr);
  const [refs, setRefs] = React.useState([] as React.RefObject<T>[]);

  React.useEffect(() => {
    setRefs(refs => (
      Array(size).fill(null).map((_, i) => refs[i] || React.createRef())
    ));
  }, [size]);

  React.useEffect(() => {
    setSize(defaultNbr);
  }, [defaultNbr]);

  const add = (count: number = 1) => {
    setSize(size + count);
  };

  const remove = (count: number = 1) => {
    setSize(size - count);
  };

  return {
    add,
    remove,
    setSize,
    refs,
    // setRefs,
  }
};

export default useRefs;
