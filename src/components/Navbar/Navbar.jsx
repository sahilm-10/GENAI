import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const Search = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "0.25rem 0.5rem",
  position: "relative",
  justifyContent: "space-between",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  margin: "0 auto",
  width: "100%",
  maxWidth: "20rem",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: 0,
    fontSize: "0.875rem",
  },
}));

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "none",
        bgcolor: "white",
        borderBottom: 2,
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "3rem!important",
          gap: "1rem",
          alignItems: "center",
          pl: "0.75rem!important",
          pr: "0.75rem!important",
        }}
      >
        <img
          src={logo}
          alt="IVP"
          style={{ maxWidth: "8rem" }}
          onClick={() => {
            navigate("/");
          }}
        />
        <Search>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
          <SearchIcon sx={{ fontSize: "1rem" }} />
        </Search>
        <IconButton
          size="small"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
        >
          <AccountCircleOutlinedIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
