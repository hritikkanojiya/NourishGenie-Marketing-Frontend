import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { SmartFunction } from "../../models/smart_functions.model";
import { SmartFunctionTable } from "./FunctionTable";
import { SmartFunctionModal } from "./FunctionModal";
import { PageTitle } from "../../../../../_metronic/layout/core";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appSmartFunction: SmartFunction | {};
};

export const SmartFunctionComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appSmartFunction: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit" | "logs",
    appSmartFunction: SmartFunction | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appSmartFunction: appSmartFunction,
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
        <title>Smart Function</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, title: "Scheduler", isSeparator: true, path: "" },
        ]}
      >
        Smart Function
      </PageTitle>
      <SmartFunctionTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <SmartFunctionModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        smartFunction={modalState.appSmartFunction}
      />
    </>
  );
};
