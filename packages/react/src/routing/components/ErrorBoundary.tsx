import { Catch, ErrorHandler, GlobalErrorsManager } from '@tokamakjs/common';
import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    this.componentDidCatch = this.componentDidCatch.bind(this);
    Reflect.set(this.componentDidCatch, 'ControllerName', this.props.children);
  }

  public static getDerivedStateFromError(error: Error): { hasError: boolean } {
    console.log('get derived');
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidMount(): void {
    const { globalErrorsManager } = this.props;
    console.log('mount', this.props.children);
    globalErrorsManager.addListener(this.componentDidCatch);
  }

  public componentWillUnmount(): void {
    const { globalErrorsManager } = this.props;
    console.log('unmount', this.props.children);
    globalErrorsManager.removeListener(this.componentDidCatch);
  }

  public componentDidCatch(error: Error, errorInfo?: ErrorInfo): boolean {
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
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
