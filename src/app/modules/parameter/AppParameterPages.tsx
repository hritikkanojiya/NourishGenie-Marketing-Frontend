import { Navigate, Route, Routes } from "react-router-dom";
import { AppParameterComponent } from "./components/AppParameter";

const AppParameterPage = () => (
  <Routes>
    <Route index element={<AppParameterComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { AppParameterPage };
