import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlightIcon from "@mui/icons-material/Flight";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
const config = require("../config.json");

const PlanDialog = ({ open, onClose, planId, onDelete }) => {
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && planId) {
      const fetchPlanDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const email = localStorage.getItem("userEmail");
          const response = await fetch(
            `${config.server_host}/user/${email}/plan/${planId}`
          );
          const data = await response.json();
          setPlanDetails(data.plan[0]);
        } catch (err) {
          setError("Error fetching plan details");
        } finally {
          setLoading(false);
        }
      };

      fetchPlanDetails();
    }
  }, [open, planId]);

  const handleDelete = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const response = await fetch(
        `${config.server_host}/user/${email}/plan/${planId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onDelete(planId);
        onClose();
      } else {
        setError("Error deleting plan");
      }
    } catch (err) {
      setError("Error deleting plan");
    }
  };

  const handleEditFlightOpen = (flight) => {
    const originCity = flight.origin_airport_city.split(",")[0];
    const destinationCity = flight.destination_airport_city.split(",")[0];
    localStorage.setItem("departureCity", originCity);
    localStorage.setItem("destinationCity", destinationCity);
    navigate(`/flight`);
  };

  const handleEditHotelOpen = (hotel) => {
    localStorage.setItem("hotelName", hotel.hotel_name);
    navigate(`/hotel`);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? <StarIcon key={i} /> : <StarBorderIcon key={i} />
      );
    }
    return stars;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Plan Details</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {planDetails && (
          <>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  Plan ID: {planDetails.plan_id}
                </Typography>
                <Typography>
                  Total Cost: $
                  {Math.round(planDetails.total_cost).toLocaleString()}
                </Typography>
                <Typography>
                  Plan Date:{" "}
                  {new Date(planDetails.plan_date).toISOString().split("T")[0]}
                </Typography>
                <Typography>
                  Cities:{" "}
                  {planDetails.cities
                    .map((city) => city.split(",")[0])
                    .join(", ")}
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Saved Flights
                </Typography>
                {planDetails.flights.map((flight, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "200px",
                      }}
                    >
                      {flight.origin_airport_city.split(",")[0]}{" "}
                      <FlightIcon
                        sx={{
                          verticalAlign: "middle",
                          transform: "rotate(90deg)",
                        }}
                      />{" "}
                      {flight.destination_airport_city.split(",")[0]}
                    </Box>
                    <Typography>${flight.fare.toFixed(2)}</Typography>
                    <Button onClick={() => handleEditFlightOpen(flight)}>
                      Edit
                    </Button>
                  </Box>
                ))}
              </CardContent>
            </Card>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Saved Hotels
                </Typography>
                {planDetails.hotels.map((hotel, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Link
                        href={hotel.hotel_website_url}
                        target="_blank"
                        rel="noopener"
                        variant="subtitle1"
                        underline="hover"
                        sx={{ color: "text.primary", width: "200px" }}
                      >
                        {hotel.hotel_name}
                      </Link>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {renderStars(hotel.hotel_rating)}
                      </Box>
                      <Button onClick={() => handleEditHotelOpen(hotel)}>
                        Edit
                      </Button>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} color="error">
          Delete Plan
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanDialog;
