import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
const config = require("../config.json");

const SignInDialog = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        if (data.password === password) {
          setMessage("Sign in successful");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", data.name);
          onLoginSuccess(email, data.name);
          onClose();
        } else {
          setMessage("Incorrect password. Please try again.");
        }
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your email and password to sign in.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p>{message}</p>}
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Sign In</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
