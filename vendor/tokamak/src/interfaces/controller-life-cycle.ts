export interface OnDidMount {
  onDidMount(): void | Promise<void>;
}

export function hasOnDidMount(value: any): value is OnDidMount {
  return value?.onDidMount != null;
}

export interface OnDidUnmount {
  onDidUnmount(): void;
}

export function hasOnDidUnmount(value: any): value is OnDidUnmount {
  return value?.onDidUnmount != null;
}

export interface OnDidRender {
  onDidRender(): void;
}

export function hasOnDidRender(value: any): value is OnDidRender {
  return value?.onDidRender != null;
}
