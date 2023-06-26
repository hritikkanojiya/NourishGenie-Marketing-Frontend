import { Navigate, Route, Routes } from "react-router-dom";
import { AppConstantComponent } from "./components/Constants";

const ConstantPage = () => (
  <Routes>
    <Route index element={<AppConstantComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { ConstantPage };
