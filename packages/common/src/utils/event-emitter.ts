import { EventListener } from '../types';

export class EventEmitter<T extends Record<string, any>> {
  private _listeners = {} as {
    [K in keyof T]?: Array<EventListener<T[K]>>;
  };

  public on<K extends keyof T>(key: K, listener: EventListener<T[K]>): VoidFunction {
    if (this._listeners[key] == null) {
      this._listeners[key] = [listener];
    } else {
      this._listeners[key]!.push(listener);
    }

    return () => {
      this.off(key, listener);
    };
  }

  public off<K extends keyof T>(key: K, listener: EventListener<T[K]>): void {
    this._listeners[key] = this._listeners[key]?.filter((l) => l !== listener);
  }

  /**
   * Clears all the listeners matching the provided key or, if no key
   * is provided, all the listeners subscribed to this emitter.
   */
  public clear<K extends keyof T>(key?: K): void {
    if (key == null) {
      this._listeners = {};
    } else {
      this._listeners[key] = [];
    }
  }

  public emit<K extends keyof T>(key: K, event: T[K]): void {
    (this._listeners[key] ?? []).forEach((l) => l(event));
  }
}
