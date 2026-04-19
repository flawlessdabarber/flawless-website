import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unexpected error occurred.';
      
      // Try to parse Firestore error JSON
      try {
        if (errorMessage.includes('Firestore Error') || errorMessage.startsWith('{')) {
          const parsed = JSON.parse(errorMessage);
          if (parsed.error) {
            errorMessage = parsed.error;
          }
        }
      } catch (e) {
        // Not JSON, ignore
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="glass p-8 rounded-3xl max-w-lg w-full border border-red-500/30">
            <h2 className="text-2xl font-bold text-red-500 mb-4 uppercase tracking-widest">Something went wrong</h2>
            <p className="text-white/70 mb-6 font-mono text-sm break-words">
              {errorMessage}
            </p>
            <button
              className="w-full py-4 bg-brand-green text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
