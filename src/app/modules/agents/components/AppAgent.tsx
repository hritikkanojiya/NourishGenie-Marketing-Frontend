/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppAgent } from "../models/app_agent.model";
import { AppAgentsTable } from "./AgentTable";
import { AuthService } from "../../auth/services/auth.service";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../common/toastify/toastify.config";
import { AppAgentModal } from "./AgentModal";
import { PageTitle } from "../../../../_metronic/layout/core";
import { APP_NAME } from "../../../common/globals/common.constants";

type ModalState = { showModal: boolean; appAgent: AppAgent | {} };

export const AppAgentComponent: FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    showModal: false,
    appAgent: {},
  });

  const navigate = useNavigate();

  const openModal = (mode: "create" | "view", appAgent: AppAgent | {} = {}) => {
    setModalState((prevState) => {
      return {
        ...prevState,
        showModal: true,
        appAgent: appAgent,
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

  const verifyAdmin = async () => {
    const isAdmin = await AuthService.currentUserIsAdmin();
    if (!isAdmin) {
      showToast("Request not authorized [appAgent]", "error");
      navigate(`/dashboard`);
    }
  };

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  useEffect(() => {
    verifyAdmin();
  }, []);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Agents | Overview</title>
      </Helmet>
      <PageTitle breadcrumbs={[]}>Agents</PageTitle>
      <AppAgentsTable
        openModal={openModal}
        reRenderComponent={modalState.showModal === false}
      />
      <AppAgentModal closeModal={closeModal} showModal={modalState.showModal} />
    </>
  );
};
