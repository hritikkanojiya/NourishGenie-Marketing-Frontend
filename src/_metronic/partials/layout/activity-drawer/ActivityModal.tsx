/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import {
  AppActivity,
  AppEventLog,
} from "../../../../app/modules/agents/models/app_agent.model";
import { ModalComponent } from "../../../../app/common/components/modal/Modal";
import { JsonViewerComponent } from "../../../../app/common/components/jsonViewer/JsonViewerComponent";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  logDetails: AppActivity | AppEventLog;
};

export const AppActivityLogModal: FC<Props> = ({
  showModal,
  closeModal,
  logDetails,
}) => {
  return (
    <>
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={
          showModal
            ? "appActivityId" in logDetails
              ? logDetails.appActivityId
              : logDetails.appEventId.toString()
            : ""
        }
        id="applogs"
        modalSize={"modal-lg"}
      >
        <JsonViewerComponent src={logDetails} />
      </ModalComponent>
    </>
  );
};
