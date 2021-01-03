export function createKillCounter(tries: number): VoidFunction {
  let remaining = tries;
  return () => {
    if (remaining <= 0) {
      throw new Error('Kill counter activated');
    }

    remaining--;
  };
}
