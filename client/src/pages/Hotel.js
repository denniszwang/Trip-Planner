import React, { useState, useEffect } from "react";
import "./Search.css";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { AppBar, Tabs, Tab, Button, Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import Table from "../components/Table";
const config = require("../config.json");
const containerStyle = {
  width: "50%",
  left: "25%",
  height: "200px",
};

const weatherApi = "aa35184e47a34fac778f4b7ebb54344f";
const mapApi = "AIzaSyAAkxzWh-FQW3UkJjQPzonay6kGyEC86Wg";
const philly = {
  lat: 39.9526,
  lng: -75.1652,
};

const SearchHotel = () => {
  const [location, setLocation] = useState(philly);
  const [autocomplete, setAutocomplete] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [popularHotels, setPopularHotels] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [inputValue, setInputValue] = useState("Philadelphia");
  const [tabIndex, setTabIndex] = useState(0);
  const [totalHotels, setTotalHotels] = useState(0);
  const [totalPopularHotels, setTotalPopularHotels] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedFlights, setSelectedFlights] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue === 0) {
      fetchHotels(inputValue, "all", page, rowsPerPage);
    } else if (newValue === 1) {
      fetchHotels(inputValue, "popular", page, rowsPerPage);
    } else if (newValue === 2) {
      fetchHotels(inputValue, "average", page, rowsPerPage);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchHotels(
      inputValue,
      tabIndex === 1 ? "popular" : tabIndex === 2 ? "average" : "all",
      newPage,
      rowsPerPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchHotels(
      inputValue,
      tabIndex === 1 ? "popular" : tabIndex === 2 ? "average" : "all",
      0,
      newRowsPerPage
    );
  };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapApi,
    libraries: ["places"],
  });

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const { lat, lng } = place.geometry.location;
        setLocation({
          lat: lat(),
          lng: lng(),
        });
        const city = place.address_components[0].long_name;
        setInputValue(city);
        fetchWeather(city).then((data) => setWeather(data));
        fetchHotels(
          city,
          tabIndex === 1 ? "popular" : tabIndex === 2 ? "average" : "all",
          page,
          rowsPerPage
        );
      } else {
        console.error("No geometry information for selected place.");
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  const fetchWeather = async (city) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApi}&units=imperial`
    );
    const data = await response.json();
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
    };
  };

  const fetchHotels = async (city, type, page = 0, rowsPerPage = 5) => {
    let url = `http://${config.server_host}:${config.server_port}/hotel/${city}`;
    if (type === "popular") {
      url += "/popular";
    } else if (type === "average") {
      url += "/average";
    }
    url += `?page=${page + 1}&limit=${rowsPerPage}`;

    const response = await fetch(url);
    const data = await response.json();
    if (type === "average") {
      setAverageRating(parseFloat(data.average_rating).toFixed(2));
    } else if (type === "popular") {
      setPopularHotels(data.hotels || []);
      setTotalPopularHotels(data.totalHotels);
    } else {
      setHotels(data.hotels || []);
      setTotalHotels(data.totalHotels);
    }
  };

  useEffect(() => {
    const storedDestinationCity = localStorage.getItem("destinationCity");
    const defaultCity = storedDestinationCity || "Philadelphia";
    setInputValue(defaultCity);

    const fetchDefaultWeather = async () => {
      setWeather(await fetchWeather(defaultCity));
      fetchHotels(defaultCity, "all", page, rowsPerPage);
    };

    const fetchDefaultLocation = async () => {
      if (storedDestinationCity) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${storedDestinationCity}&key=${mapApi}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ lat, lng });
        }
      }
    };

    fetchDefaultWeather();
    fetchDefaultLocation();
  }, [page, rowsPerPage]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleSaveHotel = (hotel) => {
    setSelectedHotels((prevSelected) => {
      if (!prevSelected.find((h) => h.id === hotel.id)) {
        return [...prevSelected, hotel];
      }
      return prevSelected;
    });
  };

  // Create a plan on the hotel page
  const createPlan = async () => {
    const userEmail = localStorage.getItem("email");

    if (
      !userEmail ||
      selectedHotels.length === 0 ||
      selectedFlights.length === 0
    ) {
      alert("Please select at least one hotel and flight to create a plan.");
      return;
    }

    const totalCost =
      selectedHotels.reduce((acc, hotel) => acc + hotel.price, 0) +
      selectedFlights.reduce((acc, flight) => acc + flight.price, 0);

    const planData = {
      total_cost: totalCost,
      hotels: selectedHotels.map((hotel) => hotel.id),
      flights: selectedFlights.map((flight) => flight.id),
    };

    try {
      const response = await fetch(
        `http://${config.server_host}:${config.server_port}/user/${userEmail}/plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(planData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Plan created successfully!");
      } else {
        alert(`Error creating plan: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("Failed to create the plan. Please try again.");
    }
  };

  return (
    <div>
      <NavBar />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          className="search-container"
        >
          <input
            type="text"
            placeholder="Enter a destination city"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="search-input"
            style={{
              width: "300px",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </Autocomplete>
        <Button
          variant="contained"
          color="secondary"
          onClick={createPlan}
          sx={{ padding: "8px 20px", marginTop: "65px" }}
        >
          Save Plan
        </Button>
      </div>
      <AppBar
        position="static"
        color="default"
        sx={{ width: "50%", margin: "0 auto" }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="All Hotel" />
          <Tab label="Popular Hotel" />
          <Tab label="Average Rating" />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <Typography sx={{ width: "50%", margin: "-10px auto 10px" }}>
          Number of hotels in {inputValue}: {totalHotels}
        </Typography>
        <Table
          hotels={hotels}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onSave={handleSaveHotel}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Table
          hotels={popularHotels}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          onSave={handleSaveHotel}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        {averageRating !== null ? (
          <Typography sx={{ width: "50%", margin: "0 auto" }}>
            Average rating of hotels in {inputValue}: {averageRating}
          </Typography>
        ) : (
          <Typography sx={{ width: "50%", margin: "0 auto" }}>
            No rating information available.
          </Typography>
        )}
      </TabPanel>

      {weather && (
        <div className="weather-container">
          <img src={weather.icon} alt="weather icon" className="weather-icon" />
          <h1 className="weather-temp">{weather.temperature}°F</h1>
          <h2 className="weather-city">{weather.city}</h2>
          <div className="weather-detail">
            <div className="detail-item">
              <p>
                <span>Humidity:</span> {weather.humidity}%
              </p>
            </div>
            <div className="detail-item">
              <p>
                <span>Wind Speed:</span> {weather.wind} mph
              </p>
            </div>
          </div>
        </div>
      )}

      <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={12}>
        <Marker position={location} />
      </GoogleMap>
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

export default SearchHotel;
