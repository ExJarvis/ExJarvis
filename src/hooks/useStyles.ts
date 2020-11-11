import { CSSProperties } from 'react';
import createUseStyles from 'react-jss';

const useStyles = <TStyle extends {}>(
  style: TStyle,
): TStyle extends (...args: any) => any
  ? Record<Extract<keyof ReturnType<TStyle>, string>, string>
  : Record<Extract<keyof TStyle, string>, string> => {
  const useStylesLocal = createUseStyles(style) as any;
  return useStylesLocal({});
};

type StylesType = (
  theme: any,
) => { [name: string]: CSSProperties | { [key: string]: CSSProperties } };

export function createStyles<T extends StylesType>(cfg: T) {
  return cfg;
}

export default useStyles;
