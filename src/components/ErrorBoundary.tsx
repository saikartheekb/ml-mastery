import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <pre style={{ 
            background: '#f4f4f4', 
            padding: '1rem', 
            overflow: 'auto', 
            maxHeight: '300px',
            textAlign: 'left',
            fontSize: '12px'
          }}>
            {this.state.error?.message}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
