import {
  Box,
  Card,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClients from "src/apiClients/apiClients";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import CommonTableCell from "src/components/CommonTableCell/CommonTableCell";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import formatString from "src/utils/stringUtils";
import { Helmet } from "react-helmet";
import { BASE_URL } from "src/apiClients/config";
function MyTransaction() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [filterTransactionDetails, setFilterTransactionDetails] = useState([]);
  const columns = [
    "Transaction Id",
    "Transaction Date",
    "Plan",
    "Price",
    "Payment Status",
    "Start Date",
    "Expiry Date",
    "Payment Method",
    "Status",
  ];

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const response = await apiClients.getTransaction();
      if (response.data) {
        setTransactionDetails(response.data);
        setFilterTransactionDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
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
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  return (
    <div>
      <Helmet>
        <title>Manage Your Transactions with Atlearn Settings</title>
        <meta
          name="description"
          content="Access and manage all your transaction details in one place with Atlearn's transaction settings. Track and review your transactions seamlessly."
        />
        <link
          rel="canonical"
          href={`${BASE_URL}/settings/mytransaction`}
        />
      </Helmet>
      <Container maxWidth={"xl"}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          mt={2}
        >
          <Typography style={{ fontSize: "2rem", fontWeight: 400 }}>
            My Transactions
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
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
                        <CommonTableCell
                          align="center"
                          colSpan={columns.length}
                          style={{ borderBottom: "none" }}
                        >
                          No Transaction
                        </CommonTableCell>
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
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.order_id || "-"}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {formatDate(new Date(row?.created_at)) || "-"}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.plan || "-"}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.price && row?.Currency === "USD" ? (
                            "$"
                          ) : (
                            <CurrencyRupeeIcon sx={{ fontSize: "16px" }} />
                          )}
                          {row?.price || "-"}
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          <span
                            style={{
                              color:
                                row?.payment_status === "authorized"
                                  ? "green"
                                  : row?.status === "pending"
                                  ? "orange"
                                  : "red",
                              fontWeight: 500,
                              padding: "5px 10px",
                              borderRadius: "5px",
                              backgroundColor:
                                row?.payment_status === "authorized"
                                  ? "#e0f2e9"
                                  : row?.payment_status === "pending"
                                  ? "#fdf2e0"
                                  : "#f2e0e0",
                              fontSize: "14px",
                            }}
                          >
                            {formatString(
                              row?.payment_status === "authorized"
                                ? "success"
                                : row?.payment_status
                            ) || "-"}
                          </span>
                        </CommonTableCell>
                        <CommonTableCell
                          align="center"
                          style={{ minWidth: "25%" }}
                        >
                          {row?.subscription_start || "-"}
                        </CommonTableCell>

                        <CommonTableCell align="center">
                          {row?.subscription_expiry || "-"}
                        </CommonTableCell>
                        <CommonTableCell align="center">
                          {row?.method || "-"}
                        </CommonTableCell>
                        <CommonTableCell align="center">
                          <span
                            style={{
                              color:
                                row?.status === "active"
                                  ? "green"
                                  : row?.status === "pending"
                                  ? "orange"
                                  : "red",
                              fontWeight: 500,
                              padding: "5px 10px",
                              borderRadius: "5px",
                              backgroundColor:
                                row?.status === "active"
                                  ? "#e0f2e9"
                                  : row?.status === "pending"
                                  ? "#fdf2e0"
                                  : "#f2e0e0",
                              fontSize: "14px",
                            }}
                          >
                            {formatString(row?.status) || "-"}
                          </span>
                        </CommonTableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <CommonTableCell colSpan={columns.length} />
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
          </Scrollbar>
          {/* </Container> */}
        </Card>
      </Container>
    </div>
  );
}

export default MyTransaction;
