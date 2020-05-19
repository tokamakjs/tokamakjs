import { Component, ReactNode } from 'react';

interface HandleLoadingProps {
  loadingView?: ReactNode;
}

interface HandleLoadingState {
  isLoading: boolean;
}

export class HandleLoading extends Component<HandleLoadingProps, HandleLoadingState> {
  constructor(props: HandleLoadingProps) {
    super(props);
    this.state = { isLoading: false };
  }

  static getDerivedStateFromError(error: any): HandleLoadingState {
    if (!error.__isLoading__) {
      return { isLoading: false };
    }

    return { isLoading: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.isLoading && this.props.loadingView != null) {
      return this.props.loadingView;
    }

    return this.props.children;
  }
}
