import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AppConstant } from "../models/app_constants.model";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppConstantsTable } from "./ConstantTable";
import { AppConstantModal } from "./ConstantsModal";
import { PageTitle } from "../../../../_metronic/layout/core";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appConstants: AppConstant | {};
};

export const AppConstantComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appConstants: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appConstants: AppConstant | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appConstants: appConstants,
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
        <title>{APP_NAME} | Constants | Overview</title>
      </Helmet>
      <PageTitle breadcrumbs={[]}>Constants</PageTitle>
      <AppConstantsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppConstantModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        appConstant={modalState.appConstants}
      />
    </>
  );
};
