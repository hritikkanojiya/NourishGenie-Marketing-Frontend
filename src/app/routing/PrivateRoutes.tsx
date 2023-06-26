import { FC, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";
import { PermissionsPage } from "../modules/permissions/PermissionPage";
import { SchedulerPages } from "../modules/scheduler/SchedulerPages";
import { ConstantPage } from "../modules/constants/ConstantPage";
import { AppListsPage } from "../modules/lists/ListsPage";
import { AppContactsPage } from "../modules/contacts/ContactPages";
import { ShortLinkPage } from "../modules/short_link/ShortLinkPage";
import { AppParameterPage } from "../modules/parameter/AppParameterPages";
import { DataMigrationPage } from "../modules/data_migration/DataMigrationPages";
import { MSG91Pages } from "../modules/msg91/MSG91Pages";
import { FirebasePages } from "../modules/firebase/FirebasePages";
import { SendInBluePages } from "../modules/sendinblue/SendInBluePages";
import AccountPage from "../modules/accounts/AccountPage";
import { CampaignPages } from "../modules/campaigns/CampaignPages";
import { AgentPages } from "../modules/agents/AgentPages";
import { DashboardPage } from "../modules/dashboard/Dashboard";
import { WABASendersPage } from "../modules/waba/WabaSenderPage";
import { ValueFirstPage } from "../modules/valuefirst/ValueFirstPage";

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registration */}
        <Route path="agent/auth/*" element={<Navigate to="/dashboard" />} />
        {/* Pages */}
        <Route path="agents/" element={<AgentPages />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="permissions/*" element={<PermissionsPage />} />
        <Route path="scheduler/*" element={<SchedulerPages />} />
        <Route path="constants/*" element={<ConstantPage />} />
        <Route path="lists/*" element={<AppListsPage />} />
        <Route path="contacts/*" element={<AppContactsPage />} />
        <Route path="ng/*" element={<ShortLinkPage />} />
        <Route path="parameters/*" element={<AppParameterPage />} />
        <Route path="migration/*" element={<DataMigrationPage />} />
        <Route path="msg91/*" element={<MSG91Pages />} />
        <Route path="firebase/*" element={<FirebasePages />} />
        <Route path="sendinblue/*" element={<SendInBluePages />} />
        <Route path="campaigns/*" element={<CampaignPages />} />
        <Route path="waba/senders/*" element={<WABASendersPage />} />
        <Route path="valuefirst/templates/*" element={<ValueFirstPage />} />
        {/* Account */}
        <Route path="agent/account/*" element={<AccountPage />} />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes, SuspensedView };
