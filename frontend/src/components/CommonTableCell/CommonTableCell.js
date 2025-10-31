import React from 'react';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/system';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: "nowrap" ,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
    
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
   
  },
}));

// CommonTableCell component
const CommonTableCell = ({ isHeader, children, fontSize, ...rest }) => {
  // Determine the TableCell class based on isHeader prop
  const cellClass = isHeader ? tableCellClasses.head : tableCellClasses.body;

  return (
    <StyledTableCell
      className={cellClass}
      fontSize={fontSize}
      {...rest} // Pass any other props to TableCell
    >
      {children}
    </StyledTableCell>
  );
};

export default CommonTableCell;



