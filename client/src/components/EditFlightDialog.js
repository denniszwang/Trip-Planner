import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FlightTable from "./FlightTable";

const config = require("../config.json");

const EditFlightDialog = ({
  open,
  onClose,
  onSave,
  flightDetails,
  flights,
}) => {
  const [selectedFlight, setSelectedFlight] = useState(flightDetails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setSelectedFlight(flightDetails);
  }, [flightDetails]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/user/${flightDetails.userId}/plan/${flightDetails.planId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ flightDetails: selectedFlight }),
        }
      );

      if (response.ok) {
        onSave();
      } else {
        setError("Error updating flight details");
      }
    } catch (err) {
      setError("Error updating flight details");
    } finally {
      setLoading(false);
    }
  };

  // Extract city names without additional details
  const extractCityName = (city) => city.split(",")[0];

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Edit Flight from {extractCityName(flightDetails.origin_airport_city)} to{" "}
        {extractCityName(flightDetails.destination_airport_city)}
      </DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel>Number of Results</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            label="Number of Results"
          >
            {[5, 10, 25, 50, 100].map((rows) => (
              <MenuItem key={rows} value={rows}>
                {rows}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FlightTable
          flights={flights}
          rowsPerPage={rowsPerPage}
          onSelectFlight={setSelectedFlight}
          selectedFlight={selectedFlight}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="error">
          Save
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFlightDialog;
