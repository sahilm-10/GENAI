import React, { useMemo, useRef, useState, useEffect } from "react";
import { Breadcrumbs, Chip, Link, Stack, Typography, Box } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useLocation, useParams } from "react-router-dom";
import PDFUtil from "../PDFViewer/PDFUtil";
import AttributeActions from "./Actions";
import { ATTRIBUTES_URL } from "../../utils/constants";

const Attributes = ({ pdfApi, setCurrentHighlight }) => {
  const { state } = useLocation();
  const fromStatus = state?.status.id;
  const [currentpage, setCurrentPage] = useState(null);
  const [status, setStatus] = useState(fromStatus ?? null);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null); 
  const { doc } = useParams();
  const gridRef = useRef();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        console.log(state);
        const url = ATTRIBUTES_URL.replace("{id}", fromStatus);
        console.log(url);
        const response = await fetch(url); 
        if (!response.ok) {
          throw new Error("Failed to fetch attributes");
        }
        const data = await response.json();
        if (data.length === 0) {
          setError("No attributes found"); 
        } else {
          setRowData(data); 
        }
      } catch (error) {
        setError("No attributes found");
      }
    };

    fetchDocuments();
  }, [fromStatus.name, state]); 

  const defaultColDef = useMemo(() => {
    return {
      suppressHeaderMenuButton: true,
    };
  }, []);

  const columnDefs = useMemo(() => {
    return [
      {
        field: "attribute",
        headerName: "Attribute Name",
        minWidth: 200,
        sortable: false,
        sort: "asc",
      },
      {
        field: "value",
        headerName: "Value",
        minWidth: 200,
        editable: true,
        flex: 1,
        sortable: false,
      },
      {
        field: "contextPages",
        headerName: "Notes",
        width: 250,
        cellStyle: { display: "flex", alignItems: "center" },
        sortable: false,
        valueFormatter: (params) => {
          return params.data.contextPageNo;
        },
        cellRenderer: (params) => {
          return (
            <Stack
              direction={"row"}
              gap={1}
              alignItems="center"
              sx={{
                height: "calc(100% - 0.75rem)",
                "& .MuiChip-root": {
                  minWidth: 65,
                  height: "100%",
                },
              }}
            >
              {params.value?.map((page, index) => {
                return (
                  <Chip
                    key={index}
                    label={`Pg-${page.contextPageNo}`}
                    variant={
                      `Index-${params.data.attribute}Pg-${page.contextPageNo}` ===
                      currentpage
                        ? "filled"
                        : "outlined"
                    }
                    disableRipple
                    onClick={() => {
                      if (pdfApi.current) {
                        const hightlights = page.highlightAreas.map(
                          ({ pageIndex, x1, y1, x2, y2 }) => {
                            const viewport =
                              pdfApi.current.getViewPort(pageIndex);
                            if (!viewport) return null;
                            const pos = PDFUtil.convertToViewportRectangle(
                              [x1, y1, x2, y2],
                              viewport
                            );
                            pos.pageIndex = pageIndex;
                            return pos;
                          }
                        );
                        setCurrentHighlight(hightlights);
                      }
                      setCurrentPage(
                        `Index-${params.data.attribute}Pg-${page.contextPageNo}`
                      );
                    }}
                  />
                );
              })}
            </Stack>
          );
        },
      },
    ];
  }, [pdfApi, currentpage]);

  const statusBar = useMemo(() => {
    return {
      statusPanels: [
        {
          statusPanel: AttributeActions,
          statusPanelParams: { status, setStatus },
        },
      ],
    };
  }, [status, setStatus]);

  return (
    <>
      <Breadcrumbs sx={{ mb: 1.5 }}>
        <Link underline="hover" color="inherit" href="/">
          Documents
        </Link>
        <Typography color="text.primary">{doc}</Typography>
      </Breadcrumbs>

      {error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : (
        <Box flexGrow={1} className="ag-theme-quartz">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            checkboxSelection={true}
            rowSelection={"single"}
            defaultColDef={defaultColDef}
            statusBar={statusBar}
          />
        </Box>
      )}
    </>
  );
};

export default Attributes;
