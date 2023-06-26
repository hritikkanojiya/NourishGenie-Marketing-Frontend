import { useState } from "react";
import { AppSubMenuModel } from "../../models/app_sub_menu.model";
import { AppSubMenusTable } from "./SubMenuTable";
import { UpdateSubMenuModal } from "./UpdateSubMenuModal";
import { AddSubMenuModal } from "./AddSubMenuModal";
import { Helmet } from "react-helmet";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appSubMenu: AppSubMenuModel | {};
};

export const AppSubMenu = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appSubMenu: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appSubMenu: AppSubMenuModel | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appSubMenu: appSubMenu,
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
        <title>{APP_NAME} | Sub Menus | Overview</title>
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
        Sub Menus
      </PageTitle>
      <AppSubMenusTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <UpdateSubMenuModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={
          modalState.showModal &&
          (modalState.editMode || modalState.readOnlyMode)
        }
        appSubMenu={modalState.appSubMenu}
      />
      <AddSubMenuModal
        closeModal={closeModal}
        showModal={
          modalState.showModal &&
          !(modalState.editMode || modalState.readOnlyMode)
        }
      />
    </>
  );
};
