import { Route, Routes } from "react-router-dom";
import { ShortLinkComponent } from "./components/ShortLink";

const ShortLinkPage = () => {
  return (
    <Routes>
      <Route path="/:id" element={<ShortLinkComponent />} />
    </Routes>
  );
};

export { ShortLinkPage };
