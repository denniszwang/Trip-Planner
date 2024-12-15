import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
const config = require("../config.json");

const AccountInfo = ({ open, onClose, email }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${config.server_host}/user/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUserInfo(data);
        } else {
          setMessage(data.error);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setMessage("An error occurred. Please try again.");
      }
    };

    if (open) {
      fetchUserInfo();
    }
  }, [open, email]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Account Information</DialogTitle>
      <DialogContent>
        {userInfo ? (
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {userInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {userInfo.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Password: {userInfo.password}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <DialogContentText>{message || "Loading..."}</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountInfo;
