import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to your error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              textAlign: 'center',
              py: 5,
            }}
          >
            <Typography variant="h4" gutterBottom>
              Something went wrong
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              We apologize for the inconvenience. Please try again later.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleRetry}
            >
              Retry
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 3, textAlign: 'left' }}>
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  <summary>Error Details</summary>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </details>
              </Box>
            )}
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;