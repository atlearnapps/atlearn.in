import React from "react";
import ParticipantNavbar from "../../../../components/navbar/participantNavbar";
import Footer from "src/components/footer/Footer"; 
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function ParticipantRoom() {
  const JoinButton = styled(Button)({
    border: "1px solid #0077c2",
    padding: "10px 20px",
    color: "#ffff",
    backgroundColor: "#1A73E8",
    "&:hover": {
      backgroundColor: "#0D5EBD",
    },
  });

  return (
    <>
      <div style={{ backgroundColor: "#F5F7FB", minHeight: "100vh" }}>
        <ParticipantNavbar />
        <Container sx={{ marginTop: "50px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              {/* <Typography sx={{ fontSize: "25px" }} gutterBottom>
                  Room 
                </Typography> */}
              <div style={{ display: "flex" }}>
                <Typography
                  variant="h2"
                  gutterBottom
                  pt={10}
                  sx={{
                    fontWeight: "400",
                    fontFamily: "inherit",
                    lineHeight: "1.1",
                    color: "inherit",
                  }}
                >
                  Home Room
                </Typography>
                <Box sx={{ pt: 9, color: "#467fcf" }}>
                  <HomeIcon />
                </Box>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Typography variant="subtitle1">1 Sessions</Typography>
                <Typography variant="subtitle1">|</Typography>
                <Typography variant="subtitle1">0 Room Recordings</Typography>
              </div>
            </div>
            <div>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} sm={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Test Room
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Session: March 27, 2023 at 12:58 PM
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      sx={{
                        // border: "1px solid #0077c2",
                        padding: "10px 20px",
                        // color: "#0077c2",
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>

                    <JoinButton>Join Room</JoinButton>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3} sm={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Test Room
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Session: March 27, 2023 at 12:58 PM
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      sx={{
                        // border: "1px solid #0077c2",
                        padding: "10px 20px",
                        color: "#0077c2",
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>

                    <JoinButton>Join Room</JoinButton>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3} sm={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Test Room
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Session: March 27, 2023 at 12:58 PM
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      sx={{
                        // border: "1px solid #0077c2",
                        padding: "10px 20px",
                        color: "#0077c2",
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>

                    <JoinButton>Join Room</JoinButton>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3} sm={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Test Room
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Session: March 27, 2023 at 12:58 PM
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      sx={{
                        // border: "1px solid #0077c2",
                        padding: "10px 20px",
                        color: "#0077c2",
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>

                    <JoinButton>Join Room</JoinButton>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={3} sm={6}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Test Room
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Last Session: March 27, 2023 at 12:58 PM
                    </Typography>
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Button
                      sx={{
                        // border: "1px solid #0077c2",
                        padding: "10px 20px",
                        color: "#0077c2",
                      }}
                    >
                      <ContentCopyIcon />
                    </Button>

                    <JoinButton>Join Room</JoinButton>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Footer />
      </div>
    </>
  );
}

export default ParticipantRoom;
