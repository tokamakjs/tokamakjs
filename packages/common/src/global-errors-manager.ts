/**
 * We need this to manually track if an error has already been
 * handled since React re-throws every error that happens in the
 * application if error boundaries are used:
 *
 * https://github.com/facebook/react/issues/11499
 */
const ALREADY_HANDLED = Symbol('ALREADY_HANDLED');

/**
 * Catches all errors that reach the top level of the
 * app and distributes them among the subscribed
 * handlers (controllers)
 */
export class GlobalErrorsManager {
  private readonly _listeners: Array<(err: Error) => boolean> = [];

  constructor() {
    window.addEventListener('error', (e) => this._handleError(e.error));
    window.addEventListener('unhandledrejection', (e) => {
      e.preventDefault();
      return this._handleError(e.reason instanceof Error ? e.reason : new Error(e.reason));
    });
  }

  public addListener(listener: (err: Error) => boolean): void {
    this._listeners.push(listener);
  }

  public removeListener(listener: Function): void {
    const index = this._listeners.findIndex((l) => l === listener);
    if (index >= 0) this._listeners.splice(index, 1);
  }

  public throw(error: Error): void {
    this._handleError(error);
  }

  private _handleError(error: Error): boolean {
    if (error == null) return false;
    if (Reflect.get(error, ALREADY_HANDLED)) return true;

    // LIFO
    for (const l of this._listeners.slice().reverse()) {
      if (error != null && l(error)) {
        Reflect.set(error, ALREADY_HANDLED, true);
        return true;
      }
    }

    Reflect.set(error, ALREADY_HANDLED, true);
    return false;
  }
}
