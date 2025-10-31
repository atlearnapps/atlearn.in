import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    TextField,
    Typography,
  } from "@mui/material";
// import { useEffect, useState } from "react"
export default function ForgetPasswordPage () {
   
    return (
       <Container>
   <Box
        sx={{
        //   width: "80%",
          // minHeight: "60vh",
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "25px", ml: 2, pt:2  }} gutterBottom>
          Forget Password
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 6 }}>
            <Container>
              <form>
                <Grid container spacing={4}>
                 
                  <Grid item xs={12} sm={8}>
                    <Typography gutterBottom> New Password</Typography>
                    <TextField
                      type="password"
                      // label="New Password "
                      name="confirmPassword"
                      // value={formData.confirmPassword}
                      // onChange={handleChange}
                      fullWidth
                    />
                    <div
                      className="passwordcheck"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingLeft: "20px",
                        marginTop: "5px",
                        gap:24
                      }}
                    >
                      <ul>
                        <li>At least 8 characters</li>
                        <li>At least 1 lowercase character</li>
                        <li>At least 1 uppercase character</li>
                      </ul>
                      <ul>
                        <li>At least 1 number</li>
                        <li>At least 1 non alphanumeric character</li>
                      </ul>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography gutterBottom>
                      New Password Confirmation
                    </Typography>
                    <TextField
                      type="password"
                      // label="confirmPassword "
                      name="confirmPassword"
                      // value={formData.confirmPassword}
                      // onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}
                  >
                    <Button type="submit" variant="contained" color="primary">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Container>
          </Box>
        </Box>
      </Box>
       </Container>
      
        
    )
}