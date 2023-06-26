import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FirebaseTemplate } from "../../models/firebase_template.model";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { FirebaseTemplatesTable } from "./TemplatesTable";
import { FirebaseTemplateModal } from "./TemplateModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  firebaseTemplate: FirebaseTemplate | {};
};

export const FirebaseTemplateComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    firebaseTemplate: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    firebaseTemplate: FirebaseTemplate | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        firebaseTemplate: firebaseTemplate,
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
        <title>{APP_NAME} | Firebase Templates | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, title: "Firebase", isSeparator: true, path: "" },
        ]}
      >
        Template
      </PageTitle>
      <FirebaseTemplatesTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <FirebaseTemplateModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        firebaseTemplate={modalState.firebaseTemplate}
      />
    </>
  );
};
