import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const SignInDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement sign-in logic here
    // For now, just close the dialog and reset the form
    setMessage("Sign in successful"); // Placeholder message
    onClose();
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
