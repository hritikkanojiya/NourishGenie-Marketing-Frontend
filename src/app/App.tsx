import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { I18nProvider } from "../_metronic/i18n/i18nProvider";
import { LayoutProvider, LayoutSplashScreen } from "../_metronic/layout/core";
import { MasterInit } from "../_metronic/layout/MasterInit";
import { AuthInit } from "./modules/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketService } from "./common/services/socket.service";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (SocketService.socket && !SocketService.socket?.active) {
      SocketService.reSetupSocketConnection();
    }
  }, [location]);

  useEffect(() => {
    setInterval(() => {
      if (!SocketService.socket?.active) {
        SocketService.reSetupSocketConnection();
      }
    }, 10000)
  }, [])

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <AuthInit>
            <Outlet />
            <MasterInit />
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>
      <ToastContainer limit={5} toastClassName="fw-bold" />
    </Suspense>
  );
};

export { App };
