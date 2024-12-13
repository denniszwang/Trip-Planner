import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import NavBar from "../components/NavBar";
import PlanDialog from "../components/PlanDialog";
const config = require("../config.json");

const mapApi = "AIzaSyAAkxzWh-FQW3UkJjQPzonay6kGyEC86Wg";

const Home = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [userName, setUserName] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const navigate = useNavigate();
  const [autocompleteSource, setAutocompleteSource] = useState(null);
  const [autocompleteDestination, setAutocompleteDestination] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapApi,
    libraries: ["places"],
  });

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      const firstName = name.split(" ")[0];
      setUserName(firstName);
    }

    const fetchPlans = async () => {
      const email = localStorage.getItem("userEmail");
      if (email) {
        try {
          const response = await fetch(
            `http://${config.server_host}:${config.server_port}/user/${email}/plan`
          );
          const data = await response.json();
          setPlans(data.plans);
        } catch (error) {
          console.error("Error fetching plans:", error);
        }
      }
    };

    fetchPlans();
  }, []);

  const handleCreateNewPlan = () => {
    localStorage.setItem("departureCity", source);
    localStorage.setItem("destinationCity", destination);
    navigate("/flight");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (planId) => {
    setSelectedPlanId(planId);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPlanId(null);
  };

  const handleDeletePlan = (planId) => {
    setPlans(plans.filter((plan) => plan.plan_id !== planId));
  };

  const formatCities = (cities) => {
    return cities.map((city) => city.split(",")[0]).join(", ");
  };

  const formatCost = (cost) => {
    return `$${Math.round(cost).toLocaleString()}`;
  };

  const onLoadSource = (autocomplete) => {
    setAutocompleteSource(autocomplete);
  };

  const onPlaceChangedSource = () => {
    if (autocompleteSource !== null) {
      const place = autocompleteSource.getPlace();
      if (place.geometry) {
        const city = place.address_components[0].long_name;
        setSource(city);
      } else {
        console.error("No geometry information for selected place.");
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  const onLoadDestination = (autocomplete) => {
    setAutocompleteDestination(autocomplete);
  };

  const onPlaceChangedDestination = () => {
    if (autocompleteDestination !== null) {
      const place = autocompleteDestination.getPlace();
      if (place.geometry) {
        const city = place.address_components[0].long_name;
        setDestination(city);
      } else {
        console.error("No geometry information for selected place.");
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

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
          Welcome to Trip Planner, {userName}
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
            onLoad={onLoadSource}
            onPlaceChanged={onPlaceChangedSource}
          >
            <TextField
              label="Departure City"
              variant="outlined"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Autocomplete>
          <Autocomplete
            onLoad={onLoadDestination}
            onPlaceChanged={onPlaceChangedDestination}
          >
            <TextField
              label="Destination City"
              variant="outlined"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Autocomplete>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewPlan}
            sx={{ height: "56px", whiteSpace: "nowrap" }}
          >
            Create New Plan
          </Button>
        </Box>
        <Typography variant="h6" gutterBottom>
          Saved Plans
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Plan ID</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Plan Date</TableCell>
                <TableCell>Cities</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plan) => (
                  <TableRow key={plan.plan_id}>
                    <TableCell>
                      <Button onClick={() => handleOpenDialog(plan.plan_id)}>
                        {plan.plan_id}
                      </Button>
                    </TableCell>
                    <TableCell>{formatCost(plan.total_cost)}</TableCell>
                    <TableCell>
                      {new Date(plan.plan_date).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell>{formatCities(plan.cities)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={plans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <PlanDialog
        open={open}
        onClose={handleCloseDialog}
        planId={selectedPlanId}
        onDelete={handleDeletePlan}
      />
    </div>
  );
};

export default Home;
