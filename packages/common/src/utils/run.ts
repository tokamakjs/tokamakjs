export function run<T = any>(next: Function): T {
  return next();
}
