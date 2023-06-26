/* eslint-disable jsx-a11y/anchor-is-valid */
import { Route, Routes } from "react-router-dom";
import { Error } from "./components/commonError";
import { Error404 } from "./components/Error404";
import { ErrorsLayout } from "./ErrorsLayout";

const ErrorsPage = () => (
  <Routes>
    <Route element={<ErrorsLayout />}>
      <Route path="404" element={<Error404 />} />
      <Route
        path="*"
        element={
          <Error
            errorCode={500}
            errorType={"System Error"}
            errorMessage={"Something went wrong! Please try again later."}
          />
        }
      />
      <Route index element={<Error404 />} />
    </Route>
  </Routes>
);

export { ErrorsPage };
