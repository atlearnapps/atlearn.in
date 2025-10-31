import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import React from "react";

function LoaderHome() {
  return (
    <div>
      <Box sx={{ flexGrow: 1, mt: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} sm={6}>
            <Card
              sx={{
                maxWidth: 345,
                minHeight: "30vh",
                boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
                // boxShadow: " 2px 0px 5px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent>
                <Stack direction="column">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                  >
                    <React.Fragment>
                      {/* <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} /> */}
                      <Skeleton animation="wave" height={20} width="80%" />
                    </React.Fragment>

                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </Stack>

                

             
                  <Skeleton
                    animation="wave"
                    height={20}
                    style={{ marginTop: 80 }}
                  />
                  <React.Fragment></React.Fragment>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mt: 4,
                    }}
                  >
                    <Skeleton animation="wave" height={30} width="30%" />
                    <Skeleton animation="wave" height={30} width="30%" />
                    
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            
          </Grid>
          <Grid item xs={12} md={3} sm={6}>
            <Card
              sx={{
                maxWidth: 345,
                minHeight: "30vh",
                boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
                // boxShadow: " 2px 0px 5px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent>
                <Stack direction="column">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                  >
                    <React.Fragment>
                      {/* <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} /> */}
                      <Skeleton animation="wave" height={20} width="80%" />
                    </React.Fragment>

                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </Stack>

                

             
                  <Skeleton
                    animation="wave"
                    height={20}
                    style={{ marginTop: 80 }}
                  />
                  <React.Fragment></React.Fragment>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mt: 4,
                    }}
                  >
                    <Skeleton animation="wave" height={30} width="30%" />
                    <Skeleton animation="wave" height={30} width="30%" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            
          </Grid>
                    <Grid item xs={12} md={3} sm={6}>
            <Card
              sx={{
                maxWidth: 345,
                minHeight: "30vh",
                boxShadow: "2px 4px 6px rgba(0, 0, 0, 0.5)",
                // boxShadow: " 2px 0px 5px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <CardContent>
                <Stack direction="column">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={3}
                  >
                    <React.Fragment>
                      {/* <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} /> */}
                      <Skeleton animation="wave" height={20} width="80%" />
                    </React.Fragment>

                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  </Stack>

                

             
                  <Skeleton
                    animation="wave"
                    height={20}
                    style={{ marginTop: 80 }}
                  />
                  <React.Fragment></React.Fragment>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mt: 4,
                    }}
                  >
                    <Skeleton animation="wave" height={30} width="30%" />
                    <Skeleton animation="wave" height={30} width="30%" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
            
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default LoaderHome;
