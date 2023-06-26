import { Navigate, Route, Routes } from "react-router-dom";
import { AppCampaignComponent } from "./components/Campaigns";

const CampaignPages = () => (
  <Routes>
    <Route index element={<AppCampaignComponent />} />
    <Route path="*" element={<Navigate to="/error/404" />} />
  </Routes>
);

export { CampaignPages };
