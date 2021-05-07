import { Catch, ErrorHandler, GlobalErrorsManager } from '@tokamakjs/common';
import { Component, ReactNode } from 'react';

const ALREADY_HANDLED = Symbol('ALREADY_HANDLED');
const HANDLER_INDEX = Symbol('HANDLER_INDEX');

interface ErrorBoundaryProps {
  name: string;
  handlers: Array<ErrorHandler>;
  children: ReactNode;
  globalErrorsManager: GlobalErrorsManager;
}

interface ErrorBoundaryState {
  error?: Error;
  handlerIndex?: number;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public readonly state: ErrorBoundaryState = {};

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.onError = this.onError.bind(this);
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, handlerIndex: Reflect.get(error, HANDLER_INDEX) };
  }

  public componentWillUnmount(): void {
    const { globalErrorsManager } = this.props;
    globalErrorsManager.removeListener(this.onError);
  }

  // We cannot use componentDidCatch since errors catched with it also
  // bubble to the top. There, they're captured by the global errors
  // manager and that causes them to get handled twice.
  public onError(error: Error): boolean {
    const { handlers } = this.props;

    // LIFO
    for (let i = handlers.length - 1; i >= 0; i--) {
      const h = handlers[i];

      // If one of the handlers of this route already handled the error just return true
      if (Reflect.get(error, ALREADY_HANDLED)) return true;

      if (!Reflect.get(error, ALREADY_HANDLED) && Catch.catches(h, error)) {
        // it's important to update the state before handling the error so any
        // further state updates happen after this one (otherwise, we could
        // end up updating an unmounted element in case there's a transition to
        // another route)
        this.setState({ error, handlerIndex: i }, () => h.catch?.(error));

        Reflect.set(error, ALREADY_HANDLED, true);
        Reflect.set(error, HANDLER_INDEX, i);

        return true;
      }
    }

    return false;
  }

  public render(): ReactNode {
    const { globalErrorsManager, handlers } = this.props;

    // Manage listeners in the render method instead of
    // something like componentDidMount to be able to
    // register them in the correct order (children are rendered
    // after parents but mounted before) and allows children
    // to react to errors before parents.
    globalErrorsManager.removeListener(this.onError);
    globalErrorsManager.addListener(this.onError);

    if (this.state.error != null) {
      const index = Reflect.get(this.state.error, HANDLER_INDEX);
      const handler = handlers[index];

      return typeof handler?.render === 'function'
        ? handler.render(this.state.error)
        : this.props.children;
    }

    return this.props.children;
  }
}
