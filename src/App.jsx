import { BrowserRouter, Route, Routes } from "react-router-dom";
import AttributeAccuracy from "./components/AttributeDetails/AttributeDetails";
import Documents from "./components/Documents/Documents";
import Layout from "./components/Layout/Layout";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Documents />} />
          <Route
            path="/attributes-details/:doc"
            element={<AttributeAccuracy />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
