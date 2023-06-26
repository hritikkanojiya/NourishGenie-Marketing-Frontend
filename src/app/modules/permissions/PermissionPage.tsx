import { Navigate, Route, Routes } from "react-router-dom";
import { AppMenu } from "./components/menu/Menu";
import { AccessGroup } from "./components/accessGroups/AccessGroup";
import { ServiceRoutes } from "./components/serviceRoutes/ServiceRoutes";
import { AppSubMenu } from "./components/subMenu/SubMenu";

const PermissionsPage = () => {
  return (
    <Routes>
      <Route path="service-routes" element={<ServiceRoutes />} />
      <Route path="access-groups" element={<AccessGroup />} />
      <Route path="menus" element={<AppMenu />} />
      <Route path="sub-menus" element={<AppSubMenu />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { PermissionsPage };
