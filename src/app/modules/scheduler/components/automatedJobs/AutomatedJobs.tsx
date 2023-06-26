import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AutomatedJob } from "../../models/automated_jobs.model";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { AutomatedJobsTable } from "./JobsTable";
import { AutomatedJobModal } from "./JobsModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  appAutomatedJob: AutomatedJob | {};
};

export const AutomatedJobComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    appAutomatedJob: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit" | "logs",
    appAutomatedJob: AutomatedJob | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        appAutomatedJob: appAutomatedJob,
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
        <title>{APP_NAME} | Automated Jobs | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          { isActive: false, title: "Scheduler", isSeparator: true, path: "" },
        ]}
      >
        Automated Job
      </PageTitle>
      <AutomatedJobsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AutomatedJobModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        automatedJob={modalState.appAutomatedJob}
      />
    </>
  );
};
