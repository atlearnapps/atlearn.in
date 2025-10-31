import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Card,
  Stack,
  Popover,
  MenuItem,
  IconButton,
  CardHeader,
  Typography,
  useTheme,
  Grid,
  Avatar,
} from "@mui/material";
// components
import Iconify from "../../../components/iconify";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { fToNow } from "src/utils/formatTime";
import apiClients from "src/apiClients/apiClients";
// ----------------------------------------------------------------------

AppTasks.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppTasks({
  fechData,
  title,
  subheader,
  list,
  ...other
}) {
  const theme = useTheme();

  // const { control } = useForm({
  //   defaultValues: {
  //     taskCompleted: ['2'],
  //   },
  // });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ mb: 2 }}
        titleTypographyProps={{ style: { fontSize: "20px", fontWeight: 600 } }}
        subheaderTypographyProps={{
          style: { fontSize: "26px", fontWeight: 600 },
        }}
        style={{backgroundColor:theme.palette.primary.main,padding:"15px",color:"white"}}

      />
      {/* <Controller
        name="taskCompleted"
        control={control}
        render={({ field }) => {
          const onSelected = (task) =>
            field.value.includes(task) ? field.value.filter((value) => value !== task) : [...field.value, task];

          return (
            <>
              {list.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  checked={field.value.includes(task.id)}
                  onChange={() => field.onChange(onSelected(task.id))}
                />
              ))}
            </>
          );
        }}
      /> */}
      {/* {list.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  checked={field.value.includes(task.id)}
                  onChange={() => field.onChange(onSelected(task.id))}
                />
              ))} */}
      <Scrollbar sx={{ height: "400px", overflow: "auto" }}>
        {" "}
        {/* Set maxHeight to your desired value */}
        {list.length > 0 ? (
          list.map((task) => (
            <TaskItem key={task.id} task={task} fechData={fechData} />
          ))
        ) : (
          <Stack
            sx={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1" sx={{ color: "#E8063C" }}>
              No Feedback
            </Typography>
          </Stack>
        )}
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  // checked: PropTypes.bool,
  // onChange: PropTypes.func,
  task: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    message: PropTypes.string,
    date: PropTypes.string,
  }),
  fechData: PropTypes.func,
};

function TaskItem({ task, fechData }) {
  const [open, setOpen] = useState(null);
  const theme = useTheme();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // const handleMarkComplete = () => {
  //   handleCloseMenu();
  //   console.log("MARK COMPLETE", task.id);
  // };

  // const handleShare = () => {
  //   handleCloseMenu();
  //   console.log("SHARE", task.id);
  // };

  // const handleEdit = () => {
  //   handleCloseMenu();
  //   console.log("EDIT", task.id);
  // };

  const handleDelete = async () => {
    try {
      const response = await apiClients.delete_feedback(task.id);
      if (response) {
        handleCloseMenu();
        if (fechData) {
          fechData();
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (fechData) {
      fechData(); // Assuming fechData doesn't require any parameters
    }
  };

  return (
    <Stack
      direction="row"
      // sx={{
      //   px: 2,
      //   py: 0.75,
      //   // ...(checked && {
      //   //   color: 'text.disabled',
      //   //   textDecoration: 'line-through',
      //   // }),
      // }}
      sx={{
        background:
          theme.palette.mode === "dark"
            ? theme.palette.dark.main
            : theme.palette.grey[50],
        padding: "16px 16px 8px",
        m: 1.25,
        borderRadius: "10px",
      }}
    >
      {/* <FormControlLabel
        // control={<Checkbox checked={checked} onChange={onChange} />}
        label={task.label}
        sx={{ flexGrow: 1, m: 0 }}
      /> */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Grid container wrap="nowrap" alignItems="center" spacing={1}>
            <Grid item>
              <Avatar
                sx={{ width: 24, height: 24 }}
                size="sm"
                alt="User 1"
                // src={comment.profile && comment.profile.avatar && avatarImage(`./${comment.profile.avatar}`)}
              />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <Typography align="left" variant="h6" component="div">
                    {task.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography align="left" variant="caption">
                    <FiberManualRecordIcon
                      sx={{
                        width: "10px",
                        height: "10px",
                        opacity: 0.5,
                        m: "0 5px",
                      }}
                    />{" "}
                    {fToNow(task.date)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ "&.MuiGrid-root": { pt: 1.5 } }}>
          <Typography align="left" variant="body2">
            {task?.message}
          </Typography>
        </Grid>
      </Grid>
      {/* <Box sx={{ flexGrow: 1, m: 1 }}>
        <Typography>{task.message}</Typography>
      </Box> */}

      <IconButton
        size="large"
        color="inherit"
        sx={{ opacity: 0.48 }}
        onClick={handleOpenMenu}
      >
        <Iconify icon={"eva:more-vertical-fill"} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        {/* <MenuItem onClick={handleMarkComplete}>
          <Iconify icon={'eva:checkmark-circle-2-fill'} sx={{ mr: 2 }} />
          Mark Complete
        </MenuItem> */}

        {/* <MenuItem onClick={handleEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}

        {/* <MenuItem onClick={handleShare}>
          <Iconify icon={'eva:share-fill'} sx={{ mr: 2 }} />
          Share
        </MenuItem> */}

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </Stack>
  );
}



