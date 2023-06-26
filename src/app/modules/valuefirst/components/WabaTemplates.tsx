import { FC, useEffect, useState } from "react";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { PageTitle } from "../../../../_metronic/layout/core";
import { Helmet } from "react-helmet";
import { WABATemplate } from "../models/wabaTemplate.model";
import { WABATemplatesTable } from "./wabaTemplateTable";
import { CreateWABATemplateModal } from "./waba_template_stepper/CreateTemplateModal";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  readOnlyMode: boolean;
  WABATemplate: WABATemplate | {};
  updateMode: boolean;
};

export const WABATemplateComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    readOnlyMode: false,
    WABATemplate: {},
    updateMode: false,
  });

  const openModal = (
    mode: "create" | "view" | "update",
    WABATemplate: WABATemplate | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        readOnlyMode: mode === "view",
        updateMode: mode === "update",
        WABATemplate: WABATemplate,
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
        <title>{APP_NAME} | WhatsApp Templates | Overview</title>
      </Helmet>

      <PageTitle
        breadcrumbs={[
          { isActive: false, path: "", isSeparator: true, title: "WhatsApp" },
        ]}
      >
        Templates
      </PageTitle>
      <WABATemplatesTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <CreateWABATemplateModal
        handleClose={closeModal}
        show={modalState.showModal}
        WABATemplate={modalState.WABATemplate}
        isReadOnly={modalState.readOnlyMode}
        editMode={modalState.updateMode}
      />
    </>
  );
};
