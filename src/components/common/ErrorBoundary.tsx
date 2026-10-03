import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  inline?: boolean;
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
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.inline) {
        return (
          <div className="p-4">
            <ErrorState
              title="Tool failed to load"
              message="We encountered an issue with this tool. Your other pages and tools remain operational."
              onRetry={this.handleRetry}
              showHomeButton={false}
              showToolsButton={true}
            />
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <ErrorState
              title="An unexpected error occurred"
              message="We encountered an issue displaying this page. Your data is safe. Please refresh or return to the directory."
              onRetry={() => {
                this.setState({ hasError: false });
                if (typeof window !== 'undefined') window.location.reload();
              }}
              showHomeButton={true}
              showToolsButton={true}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
