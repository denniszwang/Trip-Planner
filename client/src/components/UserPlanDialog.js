import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import AddPlanDialog from "./AddPlanDialog";
const config = require("../config.json");

const UserPlansDialog = ({ open, onClose, userId, userName, userEmail }) => {
  const [plans, setPlans] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchUserPlans = async () => {
        try {
          const response = await fetch(
            `${config.server_host}/user/${userId}/plan`
          );
          const data = await response.json();
          setPlans(data.plans);
        } catch (error) {
          console.error("Error fetching user plans:", error);
        }
      };

      fetchUserPlans();
    }
  }, [userId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatCities = (cities) => {
    return cities.map((city) => city.split(",")[0]).join(", ");
  };

  const formatCost = (cost) => {
    return `$${Math.round(cost).toLocaleString()}`;
  };

  const handleOpenPlanDialog = (planId) => {
    setSelectedPlanId(planId);
    setPlanDialogOpen(true);
  };

  const handleClosePlanDialog = () => {
    setPlanDialogOpen(false);
    setSelectedPlanId(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{userName}'s Plans</DialogTitle>
      <DialogContent>
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
                      <Button
                        onClick={() => handleOpenPlanDialog(plan.plan_id)}
                      >
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
      <AddPlanDialog
        open={planDialogOpen}
        onClose={handleClosePlanDialog}
        planId={selectedPlanId}
        email={userEmail}
      />
    </Dialog>
  );
};

export default UserPlansDialog;
