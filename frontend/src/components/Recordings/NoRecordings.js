import { Box } from '@mui/material'
import React from 'react'
import RecordIcon from "src/images/record/Vector (5).svg";
function NoRecordings() {
  return (
    <div>
         <Box>
          <div
            style={{
              minHeight: "40vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img  src={RecordIcon} alt="recordicon" />
              <h3 className='text-center text-primary'>
                You don't have any recordings yet!
              </h3>

              <p className='text-center'>
                Recordings will appear here after you start a meeting and record
                it.
              </p>
            </Box>
          </div>
        </Box>
    </div>
  )
}

export default NoRecordings
