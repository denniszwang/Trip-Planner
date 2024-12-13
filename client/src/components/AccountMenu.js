import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Login from "@mui/icons-material/Login";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AccountDialog from "./AccountDialog";
import AccountInfo from "./AccountInfo";
import SignInDialog from "./SignInDialog";
import { UserContext } from "../Usercontext";

export default function AccountMenu() {
  const { user, setUser } = React.useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openAccountDialog, setOpenAccountDialog] = React.useState(false);
  const [openAccountInfo, setOpenAccountInfo] = React.useState(false);
  const [openSignInDialog, setOpenSignInDialog] = React.useState(false);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    if (email && name) {
      setUser({ isLoggedIn: true, email, name });
    }
  }, [setUser]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    setOpenSignInDialog(true);
    handleClose();
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, email: "", name: "" });
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    handleClose();
  };

  const handleOpenAccountDialog = () => {
    setOpenAccountDialog(true);
    handleClose();
  };

  const handleCloseAccountDialog = () => {
    setOpenAccountDialog(false);
  };

  const handleCloseSignInDialog = () => {
    setOpenSignInDialog(false);
  };

  const handleCloseAccountInfo = () => {
    setOpenAccountInfo(false);
  };

  const handleLoginSuccess = (email, name) => {
    setUser({ isLoggedIn: true, email, name });
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
  };

  const handleOpenAccountInfo = () => {
    setOpenAccountInfo(true);
    handleClose();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {user.isLoggedIn ? (
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.name.charAt(0)}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: 30, mr: 2 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user.isLoggedIn ? (
          <>
            <MenuItem onClick={handleOpenAccountInfo}>
              <Avatar>{user.name.charAt(0)}</Avatar> My account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleOpenAccountDialog}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin}>
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Sign In
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleOpenAccountDialog}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Create new account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
          </>
        )}
      </Menu>
      <AccountDialog
        open={openAccountDialog}
        onClose={handleCloseAccountDialog}
      />
      <SignInDialog
        open={openSignInDialog}
        onClose={handleCloseSignInDialog}
        onLoginSuccess={(email, name) => handleLoginSuccess(email, name)}
      />
      <AccountInfo
        open={openAccountInfo}
        onClose={handleCloseAccountInfo}
        email={user.email}
      />
    </React.Fragment>
  );
}
