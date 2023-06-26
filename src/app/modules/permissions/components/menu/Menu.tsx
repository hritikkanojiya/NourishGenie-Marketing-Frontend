import { useState } from "react";
import { AppMenuModel } from "../../models/app_menu.model";
import { AppMenuModal } from "./MenuModal";
import { AppMenusTable } from "./MenusTable";
import { Helmet } from "react-helmet";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appMenu: AppMenuModel | {};
};

export const AppMenu = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appMenu: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appMenu: AppMenuModel | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appMenu: appMenu,
      };
    });
  };
  const closeModal = () => {
    setModalState((prevState) => {
      return { ...prevState, showModal: false };
    });
  };
  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Menus | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          {
            isActive: false,
            path: "",
            isSeparator: true,
            title: "Permissions",
          },
        ]}
      >
        Menu
      </PageTitle>
      <AppMenusTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppMenuModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        appMenu={modalState.appMenu}
      />
    </>
  );
};
