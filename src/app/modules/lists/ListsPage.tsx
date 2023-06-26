import { Route, Routes } from "react-router-dom";
import { AppListComponent } from "./components/Lists";

const AppListsPage = () => {
  return (
    <Routes>
      <Route index element={<AppListComponent />} />
    </Routes>
  );
};

export { AppListsPage };
