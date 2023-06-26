/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import { AutomatedJobLogs } from "../../models/automated_jobs.model";
import { JsonViewerComponent } from "../../../../common/components/jsonViewer/JsonViewerComponent";
import { APP_NAME } from "../../../../common/globals/common.constants";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  log: AutomatedJobLogs | {};
};

export const AutomatedJobLogsModal: FC<Props> = ({
  showModal,
  closeModal,
  log,
}) => {
  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | Automated Jobs | Logs</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Automated Job Logs"}
        id="jobLogs"
        modalSize={"modal-lg"}
      >
        <JsonViewerComponent src={log} />
      </ModalComponent>
    </>
  );
};
