import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppCampaign } from "../models/campaign.model";
import { AppCampaignsTable } from "./CampaignTables";
import { CreateAppCampaignModal } from "./campaignStepper/createCampaignModal";
import { PageTitle } from "../../../../_metronic/layout/core";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = {
  showModal: boolean;
  readOnlyMode: boolean;
  appCampaign: AppCampaign | {};
};

export const AppCampaignComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    readOnlyMode: false,
    appCampaign: {},
  });

  const openModal = (
    mode: "create" | "view",
    appCampaign: AppCampaign | {} = {}
  ) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        readOnlyMode: mode === "view",
        appCampaign: appCampaign,
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
        <title>{APP_NAME} | Campaigns | Overview</title>
      </Helmet>
      <PageTitle breadcrumbs={[]}>Campaigns</PageTitle>
      <AppCampaignsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <CreateAppCampaignModal
        handleClose={closeModal}
        show={modalState.showModal}
      />
    </>
  );
};
