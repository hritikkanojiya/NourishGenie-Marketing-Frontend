import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { AppMySQLCrypt } from "../../models/mysql_crypt_config/app_mysql_crypt.model";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { AppMySQLCryptsTable } from "./CryptTable";
import { AppMySQLCryptModal } from "./CryptModal";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  mysqlCrypt: AppMySQLCrypt | {};
};

export const MySQLCryptComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    mysqlCrypt: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    mysqlCrypt: AppMySQLCrypt | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        mysqlCrypt: mysqlCrypt,
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
        <title>{APP_NAME} | MySQL Crypts | Overview</title>
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
        MySQL Crypt
      </PageTitle>
      <AppMySQLCryptsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppMySQLCryptModal
        closeModal={closeModal}
        editMode={modalState.editMode}
        readOnlyMode={modalState.readOnlyMode}
        showModal={modalState.showModal}
        mysqlCrypt={modalState.mysqlCrypt}
      />
    </>
  );
};
