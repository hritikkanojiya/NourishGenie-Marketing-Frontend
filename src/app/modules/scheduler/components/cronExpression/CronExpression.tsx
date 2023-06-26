import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { CronExpression } from "../../models/cron_expression.model";
import { CronExpressionTable } from "./ExpressionTable";
import { CronExpressionModal } from "./ExpressionModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appCronExpression: CronExpression | {};
};

export const CronExpressionComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appCronExpression: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit" | "logs",
    appCronExpression: CronExpression | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appCronExpression: appCronExpression,
      };
    });
  };
  const closeModal = () => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: false,
      };
    });
  };

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Cron Expressions | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, title: "Scheduler", isSeparator: true, path: "" },
        ]}
      >
        Cron Expression
      </PageTitle>
      <CronExpressionTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <CronExpressionModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        cronExpression={modalState.appCronExpression}
      />
    </>
  );
};
