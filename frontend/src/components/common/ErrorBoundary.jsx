import React from 'react';
import { AlertCircle, RotateCcw, Home, LayoutDashboard, ChevronDown, ChevronUp } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="mm-page-wrapper" style={{ justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
          <div className="mm-card" style={{ maxWidth: '580px', width: '100%', textAlign: 'center', padding: '40px 32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#FEECEE',
                color: 'var(--mm-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: 'var(--mm-shadow-sm)'
              }}
            >
              <AlertCircle size={32} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--mm-plum)', marginBottom: '10px' }}>
              Something went wrong
            </h2>

            <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '24px' }}>
              An unexpected error interrupted this view. Don&rsquo;t worry--your account, session, and data remain safe and intact.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button
                onClick={this.handleReset}
                className="mm-btn-primary mm-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCcw size={15} /> Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="mm-btn-secondary mm-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Reload Page
              </button>

              <a
                href="/"
                className="mm-btn-ghost mm-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Home size={15} /> Back to Home
              </a>
            </div>

            {/* Diagnostic Details Accordion for Developers */}
            {this.state.error && (
              <div style={{ marginTop: '20px', textAlign: 'left', borderTop: '1px solid var(--mm-border)', paddingTop: '16px' }}>
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--mm-text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    margin: '0 auto'
                  }}
                >
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span>{this.state.showDetails ? 'Hide diagnostic details' : 'Show technical diagnostics'}</span>
                </button>

                {this.state.showDetails && (
                  <div
                    style={{
                      marginTop: '12px',
                      background: '#2A102D',
                      color: '#F8E8F5',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      maxHeight: '200px'
                    }}
                  >
                    <strong style={{ color: 'var(--mm-rose)' }}>Error:</strong> {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', color: '#DFCFDD' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
