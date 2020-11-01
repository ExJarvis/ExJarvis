export interface StylesProps<T> {
  classes: {
    [X in keyof T]: string;
  };
  theme: Record<string, string>;
}
