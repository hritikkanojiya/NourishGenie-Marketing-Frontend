import { Route, Routes } from "react-router-dom";
import { SendInBlueSenderComponent } from "./components/senders/Sender";
import { SendInBlueTemplateComponent } from "./components/templates/Templates";

const SendInBluePages = () => {
  return (
    <Routes>
      <Route path="sender" element={<SendInBlueSenderComponent />} />
      <Route path="templates" element={<SendInBlueTemplateComponent />} />
    </Routes>
  );
};

export { SendInBluePages };
