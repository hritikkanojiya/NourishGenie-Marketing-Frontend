import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AppList } from "../models/app_list.model";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppListsTable } from "./ListsTable";
import { AppListModal } from "./ListsModal";
import { PageTitle } from "../../../../_metronic/layout/core";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appList: AppList | {};
};

export const AppListComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appList: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appList: AppList | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appList: appList,
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
        <title>{APP_NAME} | Lists | Overview</title>
      </Helmet>
      <PageTitle breadcrumbs={[]}>Lists</PageTitle>
      <AppListsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppListModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        appList={modalState.appList}
      />
    </>
  );
};
