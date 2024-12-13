import React, { useState, useRef, useEffect } from "react";
import "./Search.css";
import {
  AppBar,
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import NavBar from "../components/NavBar";
import FlightTable from "../components/FlightTable";

const config = require("../config.json");
const mapApi = "AIzaSyAAkxzWh-FQW3UkJjQPzonay6kGyEC86Wg";

const SearchFlights = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [inputSource, setInputSource] = useState("");
  const [inputDestination, setInputDestination] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [flights, setFlights] = useState([]);
  const [averagePrice, setAveragePrice] = useState(null);
  const [popularFlights, setPopularFlights] = useState([]);
  const [totalFlights, setTotalFlights] = useState(0);
  const [error, setError] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    const storedSourceCity = localStorage.getItem("departureCity");
    const storedDestinationCity = localStorage.getItem("destinationCity");
    if (storedSourceCity) {
      setInputSource(storedSourceCity);
      setSource(storedSourceCity);
    }
    if (storedDestinationCity) {
      setInputDestination(storedDestinationCity);
      setDestination(storedDestinationCity);
    }

    if (storedSourceCity && storedDestinationCity) {
      fetchFlights(
        storedSourceCity,
        storedDestinationCity,
        "all",
        0,
        rowsPerPage
      );
    }
  }, [rowsPerPage]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    fetchFlights(
      source,
      destination,
      newValue === 1 ? "popular" : newValue === 2 ? "average" : "all",
      0,
      rowsPerPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    fetchFlights(
      source,
      destination,
      tabIndex === 1 ? "popular" : tabIndex === 2 ? "average" : "all",
      0,
      newRowsPerPage
    );
  };

  // Load the Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapApi,
    libraries: ["places"],
  });

  const onLoad = (autocompleteInstance, type) => {
    if (type === "source") {
      sourceRef.current = autocompleteInstance;
    } else {
      destinationRef.current = autocompleteInstance;
    }
  };

  const handlePlaceChange = (type) => {
    const place =
      type === "source"
        ? sourceRef.current.getPlace()
        : destinationRef.current.getPlace();

    if (place && place.address_components) {
      // Extract the city name from the address components
      const cityComponent = place.address_components.find((component) =>
        component.types.includes("locality")
      );
      const cityName = cityComponent ? cityComponent.long_name : null;

      if (type === "source" && cityName) {
        setInputSource(cityName);
      } else if (type === "destination" && cityName) {
        setInputDestination(cityName);
      }
    }
  };

  const handleSearch = () => {
    setSource(inputSource);
    setDestination(inputDestination);
    fetchFlights(
      inputSource,
      inputDestination,
      tabIndex === 1 ? "popular" : tabIndex === 2 ? "average" : "all"
    );
  };

  // Fetch flights
  const fetchFlights = async (
    source,
    destination,
    type,
    page = 0,
    limit = rowsPerPage
  ) => {
    let url = `http://${config.server_host}:${config.server_port}/flight/${source}/${destination}`;
    if (type === "popular") {
      url += "/popular";
    } else if (type === "average") {
      url += "/average";
    }
    url += `?page=${page + 1}&limit=${limit}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched Data:", data); // Log the response data

      if (type === "average") {
        const avgPrice = parseFloat(data.average_price);
        setAveragePrice(isNaN(avgPrice) ? null : avgPrice.toFixed(2));
      } else if (type === "popular") {
        setPopularFlights(data.flights || []);
        setTotalFlights(data.totalFlights || 0); // Update total flights
      } else {
        setFlights(data.flights || []);
        setTotalFlights(data.totalFlights || 0); // Update total flights
      }
    } catch (error) {
      setError("Failed to fetch flights.");
      console.error("Error fetching flights: ", error);
    }
  };

  // Go to hotel page
  const goToHotelPage = () => {
    window.location.href = "/hotel";
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <Box sx={{ p: 3, mt: 7, width: "50%", margin: "0 auto" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mt: 7, mb: 2, textAlign: "left" }}
        >
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
          <Autocomplete
            onLoad={(autocompleteInstance) =>
              onLoad(autocompleteInstance, "source")
            }
            onPlaceChanged={() => handlePlaceChange("source")}
          >
            <TextField
              label="Departure"
              variant="outlined"
              value={inputSource}
              onChange={(e) => setInputSource(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Autocomplete>

          <Autocomplete
            onLoad={(autocompleteInstance) =>
              onLoad(autocompleteInstance, "destination")
            }
            onPlaceChanged={() => handlePlaceChange("destination")}
          >
            <TextField
              label="Destination"
              variant="outlined"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Autocomplete>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ flex: 1, height: "56px", whiteSpace: "nowrap" }}
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
          <Typography sx={{ margin: "-10px auto 10px" }}>
            Number of flights from {source} to {destination}: {totalFlights}
          </Typography>
          <FlightTable
            flights={flights}
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <FlightTable
            flights={popularFlights}
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          {averagePrice !== null ? (
            <Typography sx={{ margin: "0 auto" }}>
              Average price of flights from {source} to {destination}: $
              {Number(averagePrice).toFixed(2)}
            </Typography>
          ) : (
            <Typography sx={{ width: "50%", margin: "0 auto" }}>
              No price information available.
            </Typography>
          )}
        </TabPanel>

        <Button variant="contained" color="primary" onClick={goToHotelPage}>
          Next
        </Button>

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

export default SearchFlights;
