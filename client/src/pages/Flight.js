import React, { useState } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import NavBar from "../components/NavBar";

const Flights = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSearch = () => {
    console.log(`Searching flights from ${source} to ${destination}`);
  };

  return (
    <div>
      <NavBar />
      <Box sx={{ p: 3, mt: 7 }}>
        <Typography variant="h4" gutterBottom>
          Flight Search
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            mb: 3,
            alignItems: "center",
          }}
        >
          <TextField
            label="Source City"
            variant="outlined"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Destination"
            variant="outlined"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{
              height: "56px", // Matches the height of TextField
              whiteSpace: "nowrap",
            }}
          >
            Search Flights
          </Button>
        </Box>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="All Flights" />
            <Tab label="Popular Flights" />
            <Tab label="Average Price" />
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          <Typography>No flights found.</Typography>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Typography>No popular flights found.</Typography>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <Typography>No price information available.</Typography>
        </TabPanel>
      </Box>
    </div>
  );
};

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default Flights;
