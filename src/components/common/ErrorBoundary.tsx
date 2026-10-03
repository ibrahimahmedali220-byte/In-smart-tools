import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log error diagnostics in non-production environments to prevent info disclosure
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught error:', error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <ErrorState
              title="An unexpected error occurred"
              message="We encountered an issue displaying this page. Your data is safe. Please refresh or return to the homepage."
              onRetry={this.handleRetry}
              showHomeButton={true}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
