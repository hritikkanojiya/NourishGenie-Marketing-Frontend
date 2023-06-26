import { Route, Routes } from "react-router-dom";
import { AppContactComponent } from "./components/Contacts";

const AppContactsPage = () => {
  return (
    <Routes>
      <Route index element={<AppContactComponent />} />
    </Routes>
  );
};

export { AppContactsPage };
