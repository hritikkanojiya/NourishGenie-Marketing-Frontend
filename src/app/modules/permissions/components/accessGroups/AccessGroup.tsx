// import { AccessGroup } from "../../models/access_group.model";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { AccessGroupModel } from "../../models/access_group.model";
import { AccessGroupModal } from "./AccessGroupModal";
import { AccessGroupTable } from "./AccessGroupTable";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appAccessGroups: AccessGroupModel | {};
};

export const AccessGroup: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appAccessGroups: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appAccessGroups: AccessGroupModel | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appAccessGroups: appAccessGroups,
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
        <title>{APP_NAME} | Access Groups | Overview</title>
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
        Access Groups
      </PageTitle>
      <AccessGroupTable
        openModal={openModal}
        reRenderComponent={!modalState.showModal}
      />
      <AccessGroupModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        accessGroupDetails={modalState.appAccessGroups}
      />
    </>
  );
};
