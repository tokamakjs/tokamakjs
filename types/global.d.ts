declare global {
  namespace Reflect {
    function getMetadata<T, K extends keyof T>(metadataKey: K, target: Object): T[K];
    function defineMetadata<T>(metadataKey: keyof T, value: any, target: Object): void;
  }
}

export {};
