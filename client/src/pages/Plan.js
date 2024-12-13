import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
const config = require("../config.json");

const Plans = () => {
  const [plans, setExpensivePlans] = useState([]);
  const [trips, setLongestTrips] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchExpensivePlans();
    fetchLongestTrips();
  }, []);

  const fetchExpensivePlans = async () => {
    let url = `http://${config.server_host}:${config.server_port}/plans/expensive`;
    const response = await fetch(url);
    const data = await response.json();
    setExpensivePlans(data.plans);
  };

  const fetchLongestTrips = async () => {
    let url = `http://${config.server_host}:${config.server_port}/plans/longest`;
    const response = await fetch(url);
    const data = await response.json();
    setLongestTrips(data.itineraries);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const extractCityNames = (cities) => {
    return Array.from(new Set(cities.map((city) => city.split(",")[0]))).join(
      ", "
    );
  };

  const formatNumber = (number) => {
    return Math.round(number).toLocaleString();
  };

  return (
    <div>
      <NavBar />
      <AppBar
        position="static"
        color="default"
        sx={{ width: "50%", margin: "80px auto 0 auto" }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Expensive Plans" />
          <Tab label="Longest Trips" />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        <TableContainer
          component={Paper}
          sx={{ width: "50%", margin: "-20px auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Cities Visited</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Total Flights</TableCell>
                <TableCell>Total Hotels</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((plan) => (
                  <TableRow key={plan.plan_id}>
                    <TableCell>{plan.user_name}</TableCell>
                    <TableCell>
                      {extractCityNames(plan.cities_visited)}
                    </TableCell>
                    <TableCell>${formatNumber(plan.total_cost)}</TableCell>
                    <TableCell>{plan.total_flights}</TableCell>
                    <TableCell>{plan.total_hotels}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={plans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <TableContainer
          component={Paper}
          sx={{ width: "50%", margin: "-20px auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Cities Visited</TableCell>
                <TableCell>Total Distance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((trip) => (
                  <TableRow key={trip.plan_id}>
                    <TableCell>{trip.user_name}</TableCell>
                    <TableCell>
                      {extractCityNames(trip.cities_visited)}
                    </TableCell>
                    <TableCell>
                      {formatNumber(trip.total_distance)} miles
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={trips.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </TabPanel>
    </div>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default Plans;
