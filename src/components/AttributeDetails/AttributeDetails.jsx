import { Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import AccuracyMeasure from "../Attributes/Attributes";
import PDFViewer from "../PDFViewer/PDFViewer";
import Highlights from "../PDFViewer/HighlightArea";
import { useLocation } from "react-router-dom";
import { ATTRIBUTES_URL } from "../../utils/constants";

const AttributeDetails = () => {
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const { state } = useLocation();
  const fromStatus = state?.status.id;
  const pdfRef = useRef(null);
  const url = `${ATTRIBUTES_URL.replace("{id}", fromStatus)}/pdf`;
  

  useEffect(() => {
    if (pdfRef.current && currentHighlight?.length > 0) {
      pdfRef.current.jumpToHighlightArea(currentHighlight[0]);
    }
  }, [currentHighlight]);

  return (
    <Grid container spacing={0} component="main" className="content-container">
      <Grid
        item
        xs={6}
        height="100%"
        px={1.5}
        py={2}
        borderRight={2}
        borderColor="divider"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <AccuracyMeasure
          pdfApi={pdfRef}
          setCurrentHighlight={setCurrentHighlight}
        />
      </Grid>
      <Grid item xs={6} height="100%" display="flex" pl={1.5} pt={0}>
        <PDFViewer
          ref={pdfRef}
          file={url}
          highlight={currentHighlight}
        >
          {currentHighlight && <Highlights highlights={currentHighlight} />}
        </PDFViewer>
      </Grid>
    </Grid>
  );
};

export default AttributeDetails;
