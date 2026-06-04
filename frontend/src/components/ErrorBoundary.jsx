import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <section style={{ padding: 24, maxWidth: 640, margin: '40px auto' }}>
          <h1 style={{ marginBottom: 12 }}>Erreur de l&apos;application</h1>
          <p className="callout callout--danger" style={{ marginBottom: 16 }}>
            {this.state.error.message || String(this.state.error)}
          </p>
          <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
