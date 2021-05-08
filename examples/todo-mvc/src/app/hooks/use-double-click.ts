import { DoubleClickHandler } from '../types';

export function useDoubleClick<T>(callback: (context: T) => void): DoubleClickHandler<T> {
  let timeout: NodeJS.Timeout;
  let clicked = false;

  return (context: T) => () => {
    clearTimeout(timeout);

    if (clicked) {
      callback(context);
      clicked = false;
    } else {
      clicked = true;
    }

    timeout = setTimeout(() => {
      clicked = false;
    }, 200);
  };
}
