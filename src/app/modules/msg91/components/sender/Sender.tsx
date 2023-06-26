import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { MSG91Sender } from "../../models/sender/sender.model";
import { MSG91SendersTable } from "./SenderTable";
import { MSG91SenderModal } from "./SenderModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  sender: MSG91Sender | {};
};

export const SenderComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    sender: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    sender: MSG91Sender | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        sender: sender,
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
        <title>{APP_NAME} | MSG91 Senders | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, path: "", title: "MSG91", isSeparator: true },
        ]}
      >
        Sender
      </PageTitle>
      <MSG91SendersTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <MSG91SenderModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        sender={modalState.sender}
      />
    </>
  );
};
