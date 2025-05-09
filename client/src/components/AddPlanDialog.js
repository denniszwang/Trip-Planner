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
  Snackbar,
  Alert,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
const config = require("../config.json");

const AddPlanDialog = ({ open, onClose, planId, email }) => {
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (open && planId && email) {
      const fetchPlanDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const apiUrl = `${config.server_host}/user/${email}/plan/${planId}`;
          console.log(`Fetching plan details from API: ${apiUrl}`);
          const response = await fetch(apiUrl);
          const data = await response.json();
          console.log("Fetched plan details:", data);
          if (data.plan && data.plan.length > 0) {
            setPlanDetails(data.plan[0]);
          } else {
            console.error("No plan details found:", data);
            setError("No plan details found");
          }
        } catch (err) {
          console.error("Error fetching plan details:", err);
          setError("Error fetching plan details");
        } finally {
          setLoading(false);
        }
      };

      fetchPlanDetails();
    }
  }, [open, planId, email]);

  const handleAddPlan = async () => {
    if (planDetails) {
      const userEmail = localStorage.getItem("userEmail");
      const planData = {
        hotels: planDetails.hotels.map((hotel) => hotel.hotel_id),
        flights: planDetails.flights.map((flight) => flight.flight_id),
      };

      const apiUrl = `${config.server_host}/user/${userEmail}/plan`;
      console.log("Posting to API:", apiUrl);
      console.log("Request body:", JSON.stringify(planData));

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(planData),
        });

        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (response.ok) {
          console.log("Plan added successfully");
          setSnackbarOpen(true);
          setTimeout(() => {
            setSnackbarOpen(false);
            onClose();
          }, 1500);
        } else {
          console.error("Failed to add plan:", responseData);
          setError(`Failed to add plan: ${responseData.error}`);
        }
      } catch (err) {
        console.error("Error adding plan:", err);
        setError("Error adding plan");
      }
    }
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
                    <Box>
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
                    <Typography variant="subtitle1">
                      {hotel.hotel_name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {renderStars(hotel.hotel_rating)}
                    </Box>
                    <Typography variant="body2">
                      Address: {hotel.address}
                    </Typography>
                    <Typography variant="body2">
                      Website:{" "}
                      <Link
                        href={hotel.hotel_website_url}
                        target="_blank"
                        rel="noopener"
                      >
                        {hotel.hotel_website_url}
                      </Link>
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAddPlan} color="primary">
          Add to My Plans
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Plan added successfully!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddPlanDialog;
