import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import UserPlansDialog from "../components/UserPlanDialog";
import AddPlanDialog from "../components/AddPlanDialog";
const config = require("../config.json");

const Plans = () => {
  const [plans, setExpensivePlans] = useState([]);
  const [trips, setLongestTrips] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [addPlanDialogOpen, setAddPlanDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlanEmail, setSelectedPlanEmail] = useState(null);

  useEffect(() => {
    fetchExpensivePlans();
    fetchLongestTrips();
    fetchTopUsers();
  }, []);

  const fetchExpensivePlans = async () => {
    let url = `${config.server_host}/plans/expensive`;
    const response = await fetch(url);
    const data = await response.json();
    setExpensivePlans(data.plans);
  };

  const fetchLongestTrips = async () => {
    let url = `${config.server_host}/plans/longest`;
    const response = await fetch(url);
    const data = await response.json();
    setLongestTrips(data.itineraries);
  };

  const fetchTopUsers = async () => {
    let url = `${config.server_host}/plans/stats`;
    const response = await fetch(url);
    const data = await response.json();
    setTopUsers(data.data);
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

  const handleUserClick = (userId, userName, userEmail) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedUserEmail(userEmail);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUserId(null);
    setSelectedUserName("");
    setSelectedUserEmail("");
  };

  const handlePlanClick = (planId, email) => {
    setSelectedPlanId(planId);
    setSelectedPlanEmail(email);
    setAddPlanDialogOpen(true);
  };

  const handleCloseAddPlanDialog = () => {
    setAddPlanDialogOpen(false);
    setSelectedPlanId(null);
    setSelectedPlanEmail(null);
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
          <Tab label="Top Users" />
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
                <TableCell>Total Trips</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Avg Flight Cost</TableCell>
                <TableCell>Avg Trip Distance</TableCell>
                <TableCell>Hotels Stayed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button
                        onClick={() =>
                          handleUserClick(user.email, user.name, user.email)
                        }
                      >
                        <Typography noWrap>{user.name}</Typography>
                      </Button>
                    </TableCell>
                    <TableCell>{user.total_trips}</TableCell>
                    <TableCell>${formatNumber(user.total_spent)}</TableCell>
                    <TableCell>${formatNumber(user.avg_flight_cost)}</TableCell>
                    <TableCell>
                      {formatNumber(user.avg_trip_distance)} miles
                    </TableCell>
                    <TableCell>{user.different_hotels_stayed}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={topUsers.length}
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
                    <TableCell>
                      <Button
                        onClick={() =>
                          handlePlanClick(plan.plan_id, plan.user_email)
                        }
                      >
                        <Typography noWrap>{plan.user_name}</Typography>
                      </Button>
                    </TableCell>
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
      <TabPanel value={activeTab} index={2}>
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
                    <TableCell>
                      <Button
                        onClick={() =>
                          handlePlanClick(trip.plan_id, trip.user_email)
                        }
                      >
                        <Typography noWrap>{trip.user_name}</Typography>
                      </Button>
                    </TableCell>
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
      <UserPlansDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        userId={selectedUserId}
        userName={selectedUserName}
        userEmail={selectedUserEmail}
      />
      <AddPlanDialog
        open={addPlanDialogOpen}
        onClose={handleCloseAddPlanDialog}
        planId={selectedPlanId}
        email={selectedPlanEmail}
      />
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
