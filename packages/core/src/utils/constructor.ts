export interface Constructor<T = any> extends Function {
  new (...args: Array<any>): T;
}
