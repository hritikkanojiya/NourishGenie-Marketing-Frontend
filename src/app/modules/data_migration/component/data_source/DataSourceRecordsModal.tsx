/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import { JsonViewerComponent } from "../../../../common/components/jsonViewer/JsonViewerComponent";
import { DataSourceRecord } from "../../models/data_sources/app_datasource.model";
import { APP_NAME } from "../../../../common/globals/common.constants";

type Props = {
  showModal: boolean;
  closeModal: () => void;
  record: DataSourceRecord | {};
};

export const DataSourceRecordModal: FC<Props> = ({
  showModal,
  closeModal,
  record,
}) => {
  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | Data Sources | Record</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Data Source Record"}
        id="dataSourceRecords"
        modalSize={"modal-lg"}
      >
        <JsonViewerComponent src={record} />
      </ModalComponent>
    </>
  );
};
