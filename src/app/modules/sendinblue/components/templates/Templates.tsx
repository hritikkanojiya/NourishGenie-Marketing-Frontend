import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { SendInBlueTemplatesTable } from "./TemplateTable";
import { SendInBlueTemplateModal } from "./SIBTemplateModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { SendInBlueTemplate } from "../../models/sendinblue_template.model";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  templateId?: string;
  templateDetails: SendInBlueTemplate | {};
};

export const SendInBlueTemplateComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    templateId: "",
    templateDetails: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    templateDetails: SendInBlueTemplate | {} = {},
    templateId?: string
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        templateId: templateId,
        templateDetails: templateDetails,
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
        <title>{APP_NAME} | SendInBlue Templates | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, path: "", title: "SendInBlue", isSeparator: true },
        ]}
      >
        Template
      </PageTitle>
      <SendInBlueTemplatesTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <SendInBlueTemplateModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        templateId={modalState.templateId}
        templateDetails={modalState.templateDetails}
      />
    </>
  );
};
