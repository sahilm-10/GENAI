import { Button, Stack } from "@mui/material";

const Actions = (props) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      className="ag-status-name-value"
      gap={1}
    >
      <Button
        size="small"
        variant="contained"
        disableElevation
        disableRipple
        disabled={props.status === "Rejected"}
        color={props.status === "Approved" ? "success" : "primary"}
        onClick={() => props.setStatus("Approved")}
        sx={{
          minWidth: 90,
          bgcolor: "#2e7d32!important",
          color: "white!important",
        }}
      >
        {props.status === "Approved" ? `Approved` : "Approve"}
      </Button>
      <Button
        size="small"
        color="error"
        variant="contained"
        disableElevation
        disableRipple
        disabled={props.status === "Approved"}
        onClick={() => props.setStatus("Rejected")}
        sx={{
          minWidth: 90,
          bgcolor: "#d14249!important",
          color: "white!important",
        }}
      >
        {props.status === "Rejected" ? `Rejected` : "Reject"}
      </Button>
    </Stack>
  );
};

export default Actions;
