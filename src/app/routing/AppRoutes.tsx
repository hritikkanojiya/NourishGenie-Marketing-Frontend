/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { FC, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage, useAuth } from "../modules/auth";
import { App } from "../App";
import { AuthTokenService } from "../modules/auth/services/authToken.service";
import { SocketService } from "../common/services/socket.service";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env;

const AppRoutes: FC = () => {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    const agentDetails = AuthTokenService.getAgentDetailsFromLocalStorage();
    if (agentDetails && AuthTokenService.verifyAuthToken()) {
      setCurrentUser(agentDetails);
      SocketService.setupSocketConnection();
    } else {
      setCurrentUser(undefined);
    }
  }, [setCurrentUser]);

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          {currentUser ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="agent/auth/*" element={<AuthPage />} />
              <Route
                path="*"
                element={
                  <Navigate
                    to={`agent/auth?next=${window.location.pathname}`}
                  />
                }
              />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { AppRoutes };
