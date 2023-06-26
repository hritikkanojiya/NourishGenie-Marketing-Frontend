import { Navigate, Route, Routes } from "react-router-dom";
import { WABATemplateComponent } from "./components/WabaTemplates";

const ValueFirstPage = () => (
  <Routes>
    <Route index element={<WABATemplateComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { ValueFirstPage };
