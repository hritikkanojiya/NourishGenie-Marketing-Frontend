import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { MSG91Flow } from "../../models/flow/flow.model";
import { MSG91FlowsTable } from "./FlowTable";
import { MSG91FlowModal } from "./FlowModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  readonlyMode: boolean;
  flow: MSG91Flow | {};
};

export const FlowComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    flow: {},
    readonlyMode: false,
  });

  const openModal = (mode: "create" | "view", flow: MSG91Flow | {} = {}) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        readonlyMode: mode === "view",
        flow: flow,
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
        <title>{APP_NAME} | MSG91 Flows | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, path: "", title: "MSG91", isSeparator: true },
        ]}
      >
        Flow
      </PageTitle>
      <MSG91FlowsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <MSG91FlowModal
        closeModal={closeModal}
        readOnlyMode={modalState.readonlyMode}
        showModal={modalState.showModal}
        flow={modalState.flow}
      />
    </>
  );
};
