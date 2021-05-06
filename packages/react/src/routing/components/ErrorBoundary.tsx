import { Catch, ErrorHandler, GlobalErrorsManager } from '@tokamakjs/common';
import React, { Component, ReactNode } from 'react';

const ALREADY_HANDLED = Symbol('alreadyHandled');

interface ErrorBoundaryProps {
  handlers: Array<ErrorHandler>;
  children: ReactNode;
  globalErrorsManager: GlobalErrorsManager;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, {}> {
  public readonly state = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.onError = this.onError.bind(this);
    Reflect.set(this.onError, 'ControllerName', this.props.children);
  }

  public static getDerivedStateFromError(error: Error): { hasError: boolean } {
    return { hasError: true };
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
    for (const h of handlers.slice().reverse()) {
      if (Reflect.get(error, ALREADY_HANDLED)) return true;

      if (!Reflect.get(error, ALREADY_HANDLED) && Catch.catches(h, error)) {
        h.catch?.(error);
        Reflect.set(error, ALREADY_HANDLED, true);
        return true;
      }
    }

    return false;
  }

  public render(): ReactNode {
    const { globalErrorsManager } = this.props;

    // Manage listeners in the render method instead of
    // something like componentDidMount to be able to
    // register them in the correct order (children are rendered
    // after parents but mounted before) and allows children
    // to react to errors before parents.
    globalErrorsManager.removeListener(this.onError);
    globalErrorsManager.addListener(this.onError);

    if (this.state.hasError) {
      return <h1>ERROR</h1>;
    }

    return this.props.children;
  }
}
