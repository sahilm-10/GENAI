import React, { useMemo, useRef, useState, useEffect } from "react";
import { Container, Divider, Stack, Typography, Box } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { DOCUMENTS_URL } from "../../utils/constants";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const gridRef = useRef();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(DOCUMENTS_URL); 
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const data = await response.json();
        console.log(data);
        if (data.length === 0) {
          setError("No documents found");
        } else {
          setDocuments(data); 
        }
      } catch (error) {
        setError("No documents found");
      }
    };

    fetchDocuments();
  }, []); 

  const columnDefs = useMemo(() => {
    return [
      {
        field: "facilityName",
        headerName: "Facility name",
        minWidth: 200,
        flex: 1,
        filter: "agTextColumnFilter",
        suppressColumnsToolPanel: true,
      },
      {
        field: "name",
        headerName: "Document",
        minWidth: 260,
        flex: 1,
        filter: "agTextColumnFilter",
        enableRowGroup: true,
        suppressHeaderMenuButton: false,
        suppressColumnsToolPanel: true,
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 180,
        cellStyle: { display: "flex", alignItems: "center" },
        filter: true,
        cellRenderer: (params) => {
          if (params.node.group) return null;
          return (
            <Stack
              direction="row"
              alignItems="center"
              gap={0.5}
              sx={{
                fontWeight: "bold",
                color:
                  params.value === "Approved"
                    ? "success.light"
                    : params.value === "Failed"
                    ? "error.light"
                    : "warning.light",
                "& svg": {
                  fontSize: "1.15rem",
                },
              }}
            >
              {params.value === "Approved" ? (
                <CheckCircleOutlineRoundedIcon />
              ) : params.value === "Failed" ? (
                <ErrorOutlineRoundedIcon />
              ) : (
                <AccessTimeRoundedIcon />
              )}
              <Typography fontWeight="bold" variant="body2">
                {params.value}
              </Typography>
            </Stack>
          );
        },
        suppressColumnsToolPanel: true,
      },
      {
        field: "processedOn",
        headerName: "Processed On",
        minWidth: 150,
      },
      {
        field: "processTime",
        headerName: "Process Time",
        minWidth: 150,
      },
      {
        field: "cost",
        headerName: "Cost",
        minWidth: 90,
      },
      {
        field: "lastModified",
        headerName: "Last Modified",
        minWidth: 150,
      },
    ];
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      suppressHeaderMenuButton: true,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      suppressHeaderMenuButton: false,
    };
  }, []);

  const onRowClick = (params) => {
    navigate(`/attributes-details/${params.data.id}`, {
      state: { 
         status: params.data 
      },
    });
  };

  return (
    <Container
      maxWidth="xl"
      className="content-container"
      component="main"
      sx={{ py: 2, display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6" component="h1" pl={0.5}>
        Documents
      </Typography>
      <Divider sx={{ mt: 0.5, mb: 2 }} />

      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <Box className="ag-theme-quartz" flexGrow={1}>
          <AgGridReact
            ref={gridRef}
            rowData={documents}
            columnDefs={columnDefs}
            checkboxSelection={true}
            rowSelection={"single"}
            defaultColDef={defaultColDef}
            onRowClicked={onRowClick}
            suppressContextMenu={true}
            autoGroupColumnDef={autoGroupColumnDef}
            sideBar={{
              toolPanels: [
                {
                  id: "columns",
                  labelDefault: "Columns",
                  labelKey: "columns",
                  iconKey: "columns",
                  toolPanel: "agColumnsToolPanel",
                  toolPanelParams: {
                    suppressRowGroups: true,
                    suppressValues: true,
                    suppressPivots: true,
                    suppressPivotMode: true,
                    suppressColumnFilter: true,
                    suppressColumnSelectAll: true,
                    suppressColumnExpandAll: true,
                  },
                },
              ],
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default Documents;
