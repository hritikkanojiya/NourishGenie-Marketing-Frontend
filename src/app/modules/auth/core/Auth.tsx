import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { LayoutSplashScreen } from "../../../../_metronic/layout/core";
import * as authHelper from "./AuthHelpers";
import { WithChildren } from "../../../../_metronic/helpers";
import { AgentDetails, AuthModel } from "../models/auth.model";
import { AuthTokenService } from "../services/authToken.service";
import { AuthService } from "../services/auth.service";
import { showToast } from "../../../common/toastify/toastify.config";
import { useNavigate } from "react-router-dom";
import { AppAgent } from "../../agents/models/app_agent.model";

type AuthContextProps = {
  auth: AuthModel | undefined;
  currentUser: AgentDetails | undefined;
  setCurrentUser: Dispatch<SetStateAction<AgentDetails | undefined>>;
  agent: AppAgent | undefined;
  setAgent: Dispatch<SetStateAction<AppAgent | undefined>>;
  logout: () => void;
};

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  currentUser: undefined,
  agent: undefined,
  setAgent: () => {},
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<AgentDetails | undefined>();
  const [agent, setAgent] = useState<AppAgent | undefined>();
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const logout = async () => {
    try {
      const request = await AuthService.logout();
      if ("data" in request) {
        showToast("Logged Out", "success");
      }
      saveAuth(undefined);
      setCurrentUser(undefined);
    } catch (error) {
      AuthTokenService.clearTokenFromLocalStorage();
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, currentUser, setCurrentUser, logout, agent, setAgent }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, setCurrentUser } = useAuth();
  const didRequest = useRef(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const navigate = useNavigate();
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const user = AuthTokenService.getAgentDetailsFromLocalStorage();
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        if (!didRequest.current) {
          setCurrentUser(undefined);
        }
      } finally {
        setShowSplashScreen(false);
        navigate("/agent/auth/login");
      }

      return () => (didRequest.current = true);
    };

    if (auth && auth?.data?.jwtToken) {
      requestUser();
    } else {
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
