export interface Type<T = any> extends Function {
  new (...args: Array<any>): T;
}
