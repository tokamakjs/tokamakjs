export interface OnInit {
  onModuleInit(): void | Promise<void>;
}

export interface OnDidInit {
  onModuleDidInit(): void | Promise<void>;
}

export function hasOnInit(value: any): value is OnInit {
  return value != null && (value as OnInit).onModuleInit != null;
}

export function hasOnDidInit(value: any): value is OnDidInit {
  return value != null && (value as OnDidInit).onModuleDidInit != null;
}
