/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import { JsonViewerComponent } from "../../../../common/components/jsonViewer/JsonViewerComponent";
import { DataSourceLogs } from "../../models/data_sources/app_datasource.model";
import { APP_NAME } from "../../../../common/globals/common.constants";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  log: DataSourceLogs | {};
};

export const DataSourceLogsModal: FC<Props> = ({
  showModal,
  closeModal,
  log,
}) => {
  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | Data Sources | Logs</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Data Source Logs"}
        id="jobLogs"
        modalSize={"modal-lg"}
      >
        <JsonViewerComponent src={log} />
      </ModalComponent>
    </>
  );
};
