import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WidgetErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Widget Error Boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-500/5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-rose-500 dark:text-rose-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {this.props.fallbackTitle || 'Section Unavailable'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                Something went wrong while rendering this cosmic analysis section. We've logged the error and are working on a fix.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Loading
              </button>
              
              <a
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </a>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 p-4 bg-gray-900 text-rose-300 text-xs text-left rounded-lg overflow-auto max-w-full">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
