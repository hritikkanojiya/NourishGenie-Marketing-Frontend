import { Route, Routes } from "react-router-dom";
import { ForgotPassword } from "./components/ForgotPassword";
import { Login } from "./components/Login";
import { AuthLayout } from "./AuthLayout";
import { UpdatePassword } from "./components/UpdatePassword";

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route
        path="update-password/:token/:secret"
        element={<UpdatePassword />}
      />
      <Route index element={<Login />} />
    </Route>
  </Routes>
);

export { AuthPage };
