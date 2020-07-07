export type Listener<T> = (event: T) => void;

export abstract class EventEmitter<T> {
  private _listenersByKey = {} as Record<keyof T, Array<Listener<any>>>;

  public addEventListener<K extends keyof T>(key: K, listener: Listener<T[K]>): void {
    if (this._listenersByKey[key] == null) {
      this._listenersByKey[key] = [listener];
    } else {
      this._listenersByKey[key].push(listener);
    }
  }

  public removeEventListener<K extends keyof T>(key: K, listener: Listener<T[K]>): void {
    this._listenersByKey[key] = this._listenersByKey[key].filter((l) => l !== listener);
  }

  protected emit<K extends keyof T>(key: K, event: T[K]): void {
    const eventListeners = this._listenersByKey[key];
    eventListeners.forEach((l) => l(event));
  }

  public removeEventListeners(): void {
    this._listenersByKey = {} as Record<keyof T, Array<Listener<any>>>;
  }
}
