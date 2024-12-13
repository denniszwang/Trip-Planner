import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const FlightTable = ({
  flights = [],
  rowsPerPage,
  handleChangeRowsPerPage,
}) => {
  return (
    <Paper sx={{ width: "100%", margin: "0 auto", padding: 2 }}>
      {/* Table Container */}
      <TableContainer>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {flights.slice(0, rowsPerPage).map((flight) => (
              <TableRow key={flight.flight_id}>
                <TableCell>{flight.origin_airport_city}</TableCell>
                <TableCell>{flight.destination_airport_city}</TableCell>
                <TableCell>${flight.fare}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rows Per Page Control */}
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel>Number of Results</InputLabel>
        <Select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          label="Rows per page"
        >
          {[5, 10, 25, 50, 100].map((rows) => (
            <MenuItem key={rows} value={rows}>
              {rows}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* No Results Found */}
      {flights.length === 0 && (
        <Typography variant="h6" sx={{ textAlign: "center", marginTop: 2 }}>
          No flights available.
        </Typography>
      )}
    </Paper>
  );
};

export default FlightTable;
