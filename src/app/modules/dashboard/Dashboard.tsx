import { Helmet } from "react-helmet";
import { APP_NAME } from "../../common/globals/common.constants";

export const DashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Dashboard</title>
      </Helmet>
    </>
  );
};
