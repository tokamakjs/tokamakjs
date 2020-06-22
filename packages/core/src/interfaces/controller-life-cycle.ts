export interface OnDidMount {
  onDidMount(): void | Promise<void> | VoidFunction;
}

export interface OnWillUnmount {
  onWillUnmount(): void;
}

export interface OnDidRender {
  onDidRender(): void;
}

export function hasOnDidMount(value: any): value is OnDidMount {
  return value?.onDidMount != null;
}

export function hasOnWillUnmount(value: any): value is OnWillUnmount {
  return value?.onWillUnmount != null;
}

export function hasOnDidRender(value: any): value is OnDidRender {
  return value?.onDidRender != null;
}
