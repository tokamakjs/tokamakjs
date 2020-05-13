import { Component, ReactNode } from 'react';

interface HandleErrorProps {
  errorView?: ReactNode;
}

interface HandleErrorState {
  hasError: boolean;
}

export class HandleError extends Component<HandleErrorProps, HandleErrorState> {
  constructor(props: HandleErrorProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): HandleErrorState {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError && this.props.errorView != null) {
      return this.props.errorView;
    }

    return this.props.children;
  }
}
