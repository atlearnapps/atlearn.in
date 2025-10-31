import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Popover,
  MenuItem,
  TextField,
  Box,
  InputAdornment,
  Paper,
  TablePagination,
} from "@mui/material";
import Iconify from "src/components/iconify/Iconify";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClients from "src/apiClients/apiClients";
import CloseIcon from "@mui/icons-material/Close";
import DeleteConfirmation from "src/components/confirmationPopup/confirmationPopup";
import { toast } from "react-toastify";
import Animations from "src/components/Loader";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";


const AllTransactionTable = () => {
  const columns = [
    "Transaction Id",
    "user",
    "Plan",
    "Price",
    "Start Date",
    "Expiry Date",
    "",
  ];


  // const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [Id, setId] = useState();
  const [deleteModal, setDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelIcon, setCancelIcon] = useState(false);
  const [datas, setData] = useState();
  const [open, setOpen] = useState(null);

  // const [filteredData, setFilteredData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [filterTransactionDetails, setFilterTransactionDetails] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const response = await apiClients.all_transaction();
      if (response.data) {
        setTransactionDetails(response.data);
        setFilterTransactionDetails(response.data);
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event) => {
    setCancelIcon(true);
    const { value } = event.target;
    setSearchTerm(value);
    const filtered = transactionDetails.filter((plansData) =>
      plansData.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterTransactionDetails(filtered);
  };

  const cancelSearch = () => {
    setSearchTerm("");
    const value = "";
    const filtered = transactionDetails.filter((plansData) =>
      plansData.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterTransactionDetails(filtered);
    setCancelIcon(false);
  };

  const handleDelete = async () => {
    try {
      const response = await apiClients.delete_transaction(datas.id);
      if (response) {
        toast.success(response.message);
        fetchTransaction();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenMenu = (event, data) => {
    setOpen(event.currentTarget);
    console.log(data, "data");
    setData(data);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const deleteUser = () => {
    setOpen(false);
    setDeleteModal(true);
  };
  const deleteUserClose = () => {
    setDeleteModal(false);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, transactionDetails?.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {loader ? (
        <div style={{ margin: "30px" }}>
          {" "}
          <Animations />{" "}
        </div>
      ) : (
        <>
          <Box m={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 1,
              }}
            >
              <Box>
                <TextField
                  variant="outlined"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  InputProps={{
                    endAdornment: cancelIcon ? (
                      <InputAdornment position="end">
                        <IconButton onClick={cancelSearch}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ) : (
                      <InputAdornment position="end">
                        {/* <IconButton >
                          <CloseIcon fontSize="small" />
                        </IconButton> */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <TableContainer
              style={{ border: "1px solid #F4F6F8" }}
              component={Paper}
            >
              <Table sx={{ minHeight: "30vh" }}>
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <CommonTableCell
                        align="center"
                        //   sx={{ whiteSpace: "nowrap" }}
                        key={index}
                        style={{ minWidth: "25%" }}
                      >
                        {column}
                      </CommonTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!filterTransactionDetails?.length && (
                    <TableRow sx={{ height: "100px" }}>
                      <TableCell
                        align="center"
                        colSpan={columns.length}
                        style={{ borderBottom: "none" }}
                      >
                        No Transaction
                      </TableCell>
                    </TableRow>
                  )}
                  {(rowsPerPage > 0
                    ? filterTransactionDetails?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : filterTransactionDetails
                  ).map((row, index) => (
                    <TableRow
                      sx={
                        {
                          // "&:hover": {
                          //   backgroundColor: "#F4F6F8",
                          // },
                        }
                      }
                      key={index}
                    >
                      <TableCell align="center">{row?.order_id}</TableCell>
                      <TableCell align="center">{row?.user?.name}</TableCell>
                      <TableCell align="center">{row?.plan}</TableCell>
                      <TableCell align="center">{row?.price}</TableCell>
                      <TableCell align="center">
                        {row?.subscription_start}
                      </TableCell>

                      <TableCell align="center">
                        {row?.subscription_expiry}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="large"
                          color="inherit"
                          onClick={(event) => handleOpenMenu(event, row)}
                        >
                          <Iconify icon={"eva:more-vertical-fill"} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={columns.length} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {filterTransactionDetails?.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={transactionDetails?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Box>
        </>
      )}
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={deleteUser} sx={{ color: "error.main" }}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {deleteModal && (
        <DeleteConfirmation
          open={deleteModal}
          handleClose={deleteUserClose}
          handleConfirm={handleDelete}
          // fetchData={fetchData}
        />
      )}
    </>
  );
};

export default AllTransactionTable;
