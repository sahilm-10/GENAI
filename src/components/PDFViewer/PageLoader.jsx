import { CircularProgress, Stack } from "@mui/material";
import React from "react";

const PageLoader = () => {
  return (
    <Stack
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", height: "100%" }}
    >
      <CircularProgress sx={{ display: "block", margin: "auto" }} />
    </Stack>
  );
};

export default PageLoader;
