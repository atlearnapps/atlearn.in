import { Box, Skeleton } from "@mui/material";
import React from "react";

function BoxLoader() {
  return (
    <div>
      <Box p={2}>
        <Skeleton
          variant="rectangular"
          sx={{ borderRadius: "12px" }}
          width={"100%"}
          height={400}
        />
      </Box>
    </div>
  );
}

export default BoxLoader;
