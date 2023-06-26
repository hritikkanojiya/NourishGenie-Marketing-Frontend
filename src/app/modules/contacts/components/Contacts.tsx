import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppContact } from "../models/app_contacts.model";
import { AppContactsTable } from "./ContactsTable";
import { AppContactModal } from "./ContactsModal";
import { PageTitle } from "../../../../_metronic/layout/core";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appContact: AppContact | {};
};

export const AppContactComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appContact: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appContact: AppContact | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appContact: appContact,
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
        <title>{APP_NAME} | Contacts | Overview</title>
      </Helmet>
      <PageTitle breadcrumbs={[]}>Contacts</PageTitle>
      <AppContactsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppContactModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        appContact={modalState.appContact}
      />
    </>
  );
};
