export interface OnDidMount {
  onDidMount(): void | Promise<void> | VoidFunction;
}

export function hasOnDidMount(value: any): value is OnDidMount {
  return value?.onDidMount != null;
}

export interface OnWillUnmount {
  onWillUnmount(): void;
}

export function hasOnDidUnmount(value: any): value is OnWillUnmount {
  return value?.onDidUnmount != null;
}

export interface OnDidRender {
  onDidRender(): void;
}

export function hasOnDidRender(value: any): value is OnDidRender {
  return value?.onDidRender != null;
}
