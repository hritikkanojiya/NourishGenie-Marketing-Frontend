import { Navigate, Route, Routes } from "react-router-dom";
import { AppAgentComponent } from "./components/AppAgent";

const AgentPages = () => (
  <Routes>
    <Route index element={<AppAgentComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { AgentPages };
