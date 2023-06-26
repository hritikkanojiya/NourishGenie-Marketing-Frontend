import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { AppDataSource } from "../../models/data_sources/app_datasource.model";
import { AppDataSourceTable } from "./DataSourceTable";
import { AppDataSourceModal } from "./DatasourceModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  dataSource: AppDataSource | {};
};

export const DataSourceComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    dataSource: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    dataSource: AppDataSource | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        dataSource: dataSource,
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
        <title>{APP_NAME} | Data Sources | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          {
            isActive: false,
            path: "",
            title: "Data Migration",
            isSeparator: true,
          },
        ]}
      >
        Data Source
      </PageTitle>
      <AppDataSourceTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppDataSourceModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        dataSource={modalState.dataSource}
      />
    </>
  );
};
