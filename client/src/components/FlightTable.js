import React, { useState, useEffect } from "react";
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
  Button,
} from "@mui/material";

const FlightTable = ({
  flights = [],
  rowsPerPage,
  handleChangeRowsPerPage,
  onSave,
}) => {
  const [selectedFlights, setSelectedFlights] = useState([]);

  useEffect(() => {
    const selectedFlightIds =
      JSON.parse(localStorage.getItem("selectedFlightIds")) || [];
    setSelectedFlights(selectedFlightIds);
  }, []);

  const handleSelect = (flight) => {
    let selectedFlightIds =
      JSON.parse(localStorage.getItem("selectedFlightIds")) || [];
    if (selectedFlightIds.includes(flight.flight_id)) {
      selectedFlightIds = selectedFlightIds.filter(
        (id) => id !== flight.flight_id
      );
      setSelectedFlights((prev) =>
        prev.filter((id) => id !== flight.flight_id)
      );
    } else {
      selectedFlightIds.push(flight.flight_id);
      setSelectedFlights((prev) => [...prev, flight.flight_id]);
    }
    localStorage.setItem(
      "selectedFlightIds",
      JSON.stringify(selectedFlightIds)
    );
    onSave(flight);
  };

  return (
    <Paper sx={{ width: "100%", margin: "0 auto", padding: 2 }}>
      {/* Table Container */}
      <TableContainer>
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell>Average Price</TableCell>
              <TableCell>Lowest Price</TableCell>
              <TableCell>Passengers Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {flights.slice(0, rowsPerPage).map((flight) => (
              <TableRow key={flight.flight_id}>
                <TableCell>${flight.fare}</TableCell>
                <TableCell>${flight.fare_low}</TableCell>
                <TableCell>{flight.passengers}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={
                      selectedFlights.includes(flight.flight_id)
                        ? "secondary"
                        : "primary"
                    }
                    onClick={() => handleSelect(flight)}
                  >
                    {selectedFlights.includes(flight.flight_id)
                      ? "Unselect"
                      : "Select"}
                  </Button>
                </TableCell>
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
