import React from "react";
import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { Settings } from "./components/settings/Settings";
import { AccountHeader } from "./AccountHeader";
import { useAuth } from "../auth";
import { Overview } from "./components/Overview";
import { AppActivityTable } from "./components/ActivityDetails";

const AccountPage: React.FC = () => {
  const { currentUser } = useAuth();
  return (
    <Routes>
      <Route
        element={
          <>
            {" "}
            <AccountHeader /> <Outlet />{" "}
          </>
        }
      >
        {/* Modules */}
        <Route path=":appAgentId/overview" element={<Overview />} />
        <Route path=":appAgentId/activity" element={<AppActivityTable />} />
        <Route path=":appAgentId/logs" element={<Settings />} />
        {/* Index */}
        <Route index element={<Navigate to={`${currentUser?.appAgentId}`} />} />
        {/* Redirect */}
        <Route
          path={`${currentUser?.appAgentId}`}
          element={<Navigate to="overview" />}
        />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

export default AccountPage;
