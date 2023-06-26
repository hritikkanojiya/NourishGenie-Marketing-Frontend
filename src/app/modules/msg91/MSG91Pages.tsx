import { Route, Routes } from "react-router-dom";
import { SenderComponent } from "./components/sender/Sender";
import { FlowComponent } from "./components/flow/MSG91Flow";

const MSG91Pages = () => {
  return (
    <Routes>
      <Route path="sender" element={<SenderComponent />} />
      <Route path="flow" element={<FlowComponent />} />
    </Routes>
  );
};

export { MSG91Pages };
