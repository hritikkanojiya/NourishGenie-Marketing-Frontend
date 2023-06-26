import { Navigate, Route, Routes } from "react-router-dom";
import { WABASenderComponent } from "./components/WABASenders";

const WABASendersPage = () => (
  <Routes>
    <Route index element={<WABASenderComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { WABASendersPage };
