export type TrackedCallback<T = any> = (self: T, isPending: boolean) => void;

export type Promiser = (...args: any) => Promise<any>;
