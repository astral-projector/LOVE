import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#E8EEEB', background: '#0E1513', minHeight: '100vh' }}>
          <h1 style={{ color: '#C2683F' }}>Runtime error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#D9B25F', marginTop: 16 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
