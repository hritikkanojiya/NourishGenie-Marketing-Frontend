import { Navigate, Route, Routes } from "react-router-dom";
import { AutomatedJobComponent } from "./components/automatedJobs/AutomatedJobs";
import { CronExpressionComponent } from "./components/cronExpression/CronExpression";
import { SmartFunctionComponent } from "./components/smartFunctions/SmartFunctions";
// import {} from '../'

const SchedulerPages = () => {
  return (
    <Routes>
      <Route path="automated-job" element={<AutomatedJobComponent />} />
      <Route path="cron-expression" element={<CronExpressionComponent />} />
      <Route path="smart-function" element={<SmartFunctionComponent />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { SchedulerPages };
