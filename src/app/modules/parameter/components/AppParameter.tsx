import { FC, useEffect, useState } from "react";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppParameter } from "../models/app_parameter.model";
import { AppParametersTable } from "./ParameterTable";
import { AppParameterModal } from "./ParameterModal";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appParameter: AppParameter | {};
};

export const AppParameterComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appParameter: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    appParameter: AppParameter | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appParameter: appParameter,
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
        <title>{APP_NAME} | Parameters | Overview</title>
      </Helmet>
      <PageTitle breadcrumbs={[]}>Parameter</PageTitle>
      <AppParametersTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppParameterModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        appParameter={modalState.appParameter}
      />
    </>
  );
};
