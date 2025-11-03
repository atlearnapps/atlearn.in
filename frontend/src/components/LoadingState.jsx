import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingState = ({ message = 'Loading...', fullscreen = false }) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: fullscreen ? '100vh' : '100%',
        p: 3,
      }}
    >
      <CircularProgress />
      {message && (
        <Typography
          variant="body2"
          sx={{ mt: 2, color: 'text.secondary' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  return fullscreen ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.default',
        zIndex: 9999,
      }}
    >
      {content}
    </Box>
  ) : content;
};

LoadingState.propTypes = {
  message: PropTypes.string,
  fullscreen: PropTypes.bool,
};

export default LoadingState;