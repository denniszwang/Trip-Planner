import React, { useState, useEffect } from "react";
import "./Search.css";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import NavBar from "../components/NavBar";

const containerStyle = {
  width: "50%",
  left: "25%",
  height: "250px",
};

const weatherApi = "aa35184e47a34fac778f4b7ebb54344f";
const mapApi = "AIzaSyAAkxzWh-FQW3UkJjQPzonay6kGyEC86Wg";
const philly = {
  lat: 39.9526,
  lng: -75.1652,
};

const SearchCity = () => {
  const [location, setLocation] = useState(philly);
  const [autocomplete, setAutocomplete] = useState(null);
  const [weather, setWeather] = useState(null);
  const [inputValue, setInputValue] = useState("Philadelphia");

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
        fetchWeather(city).then((data) => setWeather(data));
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

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setWeather(await fetchWeather("Philadelphia"));
    };
    fetchDefaultWeather();
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
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
        />
      </Autocomplete>
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

export default SearchCity;
