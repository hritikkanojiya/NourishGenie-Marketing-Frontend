import { Navigate, Route, Routes } from "react-router-dom";
import { FirebaseTemplateComponent } from "./components/templates/FirebaseTemplate";

const FirebasePages = () => (
  <Routes>
    <Route path="templates" element={<FirebaseTemplateComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { FirebasePages };
