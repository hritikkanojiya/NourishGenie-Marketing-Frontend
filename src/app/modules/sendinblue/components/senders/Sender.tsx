import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { SendInBlueSender } from "../../models/sendinblue_sender.model";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { SendInBlueSendersTable } from "./SendersTable";
import { SendInBlueSenderModal } from "./SenderModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  sender: SendInBlueSender | {};
};

export const SendInBlueSenderComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    sender: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    sender: SendInBlueSender | {} = {}
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
        <title>{APP_NAME} | SendInBlue Senders | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, path: "", title: "SendInBlue", isSeparator: true },
        ]}
      >
        Sender
      </PageTitle>
      <SendInBlueSendersTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <SendInBlueSenderModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        sender={modalState.sender}
      />
    </>
  );
};
