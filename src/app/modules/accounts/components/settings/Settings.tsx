import { Helmet } from "react-helmet";
import { useAuth } from "../../../auth";

export function Settings() {
  const { currentUser } = useAuth();

  return (
    <>
      <Helmet>
        <title>{currentUser?.username} | Profile</title>
      </Helmet>
      {/* Version 2 [Start]*/}
      {/* <EmailPreferences /> */}
      {/* <Notifications /> */}
      {/* Version 2 [End] */}
    </>
  );
}
