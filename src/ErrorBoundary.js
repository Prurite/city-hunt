import React from 'react';
import { Alert } from 'react-bootstrap';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.errorInfo)
      return (<>
        <Alert variant="danger" className="m-3">
          {this.state.error && this.state.error.toString()}
        </Alert>
      </>);
    return this.props.children;
  }
}