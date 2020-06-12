export interface OnModuleInit {
  onModuleInit(): void | Promise<void>;
}

export interface OnModuleDidInit {
  onModuleDidInit(): void | Promise<void>;
}

export function hasOnInit(value: any): value is OnModuleInit {
  return value != null && (value as OnModuleInit).onModuleInit != null;
}

export function hasOnDidInit(value: any): value is OnModuleDidInit {
  return value != null && (value as OnModuleDidInit).onModuleDidInit != null;
}
