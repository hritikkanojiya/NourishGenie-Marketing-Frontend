import { FC, useEffect, useState } from "react";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Helmet } from "react-helmet";
import { WABASender } from "../models/waba_sender.model";
import { WABASendersTable } from "./wabaSenderTable";
import { WABASenderModal } from "./WABASenderModal";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  WABASender: WABASender | {};
};

export const WABASenderComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    WABASender: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    WABASender: WABASender | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        WABASender: WABASender,
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
        <title>{APP_NAME} | WhatsApp Senders | Overview</title>
      </Helmet>

      <PageTitle
        breadcrumbs={[
          { isActive: false, path: "", isSeparator: true, title: "WhatsApp" },
        ]}
      >
        Senders
      </PageTitle>
      <WABASendersTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <WABASenderModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        WABASender={modalState.WABASender}
      />
    </>
  );
};
