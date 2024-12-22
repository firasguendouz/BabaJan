import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to an analytics or logging service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h1 style={styles.heading}>Something went wrong.</h1>
          <p style={styles.message}>We're working to fix this issue. Please try refreshing the page.</p>
          {this.state.error && (
            <details style={styles.details}>
              <summary>View Error Details</summary>
              <pre>{this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Inline Styles (Optional: Move to a separate CSS/SCSS file if preferred)
const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    marginTop: '5rem',
  },
  heading: {
    fontSize: '2rem',
    color: '#ff4d4f',
  },
  message: {
    fontSize: '1rem',
    marginTop: '1rem',
  },
  details: {
    marginTop: '1.5rem',
    textAlign: 'left',
    overflow: 'auto',
    backgroundColor: '#f7f7f7',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
};

export default ErrorBoundary;
