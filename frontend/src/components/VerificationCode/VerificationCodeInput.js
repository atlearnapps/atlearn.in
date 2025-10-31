import React, { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const VerificationCodeInput = () => {
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputRefs = useRef([...Array(5)].map(() => React.createRef()));

  const handleInputChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);

    // Move forward to the next input
    if (value !== '' && index < 4) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    // Move backward and remove the digit
    if (event.key === 'Backspace' && index > 0) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      inputRefs.current[index - 1].current.focus();
    } else if (event.key === 'Backspace' && index === 0) {
      // Move backward to the last input if backspace is pressed in the first input
      inputRefs.current[0].current.focus();
    }
  };

  useEffect(() => {
    // Move backward on Backspace in the first input
    const handleFirstInputBackspace = (event) => {
      if (event.key === 'Backspace' && code[0] === '') {
        inputRefs.current[4].current.focus();
      }
    };

    document.addEventListener('keydown', handleFirstInputBackspace);

    return () => {
      document.removeEventListener('keydown', handleFirstInputBackspace);
    };
  }, [code]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
    <Typography variant="h5" gutterBottom>
      Check Your Email For A Code
    </Typography>
    <Typography variant="body1" align="center" gutterBottom>
      Please enter the verification code sent to your email address ameents.ts@gmail.com
    </Typography>
    <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
      {code.map((value, index) => (
        <TextField
          key={index}
          inputRef={inputRefs.current[index]}
          type="text"
          variant="outlined"
          margin="dense"
          inputProps={{
            maxLength: 1,
            style: {
              width: '2rem',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            },
          }}
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </Box>
  </Box>
  );
};

export default VerificationCodeInput;
