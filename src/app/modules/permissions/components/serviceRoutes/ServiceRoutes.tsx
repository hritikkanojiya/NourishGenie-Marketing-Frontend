import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import { ServiceRoute } from "../../models/service_route.model";
import { ServiceRouteModal } from "./RouteModal";
import { ServiceRoutesTable } from "./RoutesTable";
import { PageTitle } from "../../../../../_metronic/layout/core";
import { APP_NAME } from "../../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  editMode: boolean;
  readOnlyMode: boolean;
  routeDetails: ServiceRoute | {};
};

export const ServiceRoutes: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    editMode: false,
    readOnlyMode: false,
    routeDetails: {},
  });

  const openModal = (
    mode: "create" | "view" | "edit",
    routeDetails: ServiceRoute | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        editMode: mode === "edit",
        readOnlyMode: mode === "view",
        routeDetails: routeDetails,
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
        <title>{APP_NAME} | Service Routes | Overview</title>
      </Helmet>
      <PageTitle
        breadcrumbs={[
          {
            isActive: false,
            path: "",
            isSeparator: true,
            title: "Permissions",
          },
        ]}
      >
        Service Routes
      </PageTitle>
      <ServiceRouteModal
        editMode={modalState.editMode}
        showModal={modalState.showModal}
        closeModal={closeModal}
        readOnlyMode={modalState.readOnlyMode}
        routeDetails={modalState.routeDetails}
      />
      <ServiceRoutesTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
    </>
  );
};
