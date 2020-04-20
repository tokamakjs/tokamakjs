export interface OnInit {
  onInit(): void | Promise<void>;
}

export interface OnDidInit {
  onDidInit(): void | Promise<void>;
}

export function hasOnInit(value: any): value is OnInit {
  return value != null && (value as OnInit).onInit != null;
}

export function hasOnDidInit(value: any): value is OnDidInit {
  return value != null && (value as OnDidInit).onDidInit != null;
}
