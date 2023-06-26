/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import BlockUI from "@availity/block-ui";

import CopyToClipboard from "react-copy-to-clipboard";
import {
  CURRENT_PAGE,
  getMetaDataValues,
  getUrlParamString,
  onChangeSortObj,
  sortObj,
} from "../../../common/globals/common.constants";
import { PaginationComponent } from "../../../common/components/pagination/PaginationComponent";
import { showToast } from "../../../common/toastify/toastify.config";
import { BlockUiDesign } from "../../../common/components/blockUiDesign/BlockUiDesign";
import { MenuComponent } from "../../../../_metronic/assets/ts/components";
import { AppAgent, GetAgentOptions } from "../models/app_agent.model";
import { AppAgentService } from "../services/app_agent.service";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AgentFilterDropdown } from "./AgentsFilterDropdown";
import { SocketService } from "../../../common/services/socket.service";
import { AuthService } from "../../auth/services/auth.service";
import Avatar from "react-avatar";
import { MetaData } from "../../../common/globals/common.model";

type Props = {
  openModal: (mode: "create", appConstantDetails: AppAgent | {}) => any;
  reRenderComponent: boolean;
};

export const AppAgentsTable: FC<Props> = ({ openModal, reRenderComponent }) => {
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [connectedAgents, setConnectedAgents] = useState<AppAgent[]>([]);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [state, setState] = useState<{
    appAgents: AppAgent[];
    agentsCount: number;
  }>({
    appAgents: [],
    agentsCount: 0,
  });

  const [paginationState, setPaginationState] = useState({
    itemsPerPage: 10,
    showingFrom: 1,
    showingTill: 10,
    page: page ? page : CURRENT_PAGE,
  });

  const [currentPage, setCurrentPage] = useState(paginationState.page);

  const [sortState, setSortState] = useState<sortObj>({
    sortBy: null,
    sortOn: null,
  });

  const [filterOptions, setFilterOptions] = useState<GetAgentOptions>({
    appAccessGroupId: null,
    search: null,
    page: 1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (SocketService.socket?.active) {
      SocketService.socket.on("connectedAgents", (data: AppAgent[]) => {
        setConnectedAgents(data);
      });
    }
  }, []);

  const getAppAgents = async (options?: GetAgentOptions) => {
    try {
      setLoading(true);
      const request = await AppAgentService.getAgents(options);
      const response = request;
      if (
        "data" in response &&
        "message" in response.data &&
        "message" in response.data
      ) {
        const totalRecords = response.data.metaData.total_records || 0;
        setState((previousState) => {
          return {
            ...previousState,
            appAgents: response.data.appAgents,
            agentsCount: totalRecords,
          };
        });
        const currentPage = paginationState.page;
        const itemsPerPage = paginationState.itemsPerPage;
        let showingFrom = (currentPage - 1) * itemsPerPage + 1;
        let showingTill: any;
        if (totalRecords)
          showingTill = Math.min(totalRecords, currentPage * itemsPerPage);
        setPaginationState((prevState) => {
          return {
            ...prevState,
            showingFrom: showingFrom,
            showingTill: showingTill,
          };
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const viewAgent = async (agentId: string) => {
    const request = await AppAgentService.getAgentDetails(agentId);
    if ("data" in request) {
      const isAdmin =
        request.data.appAgentAccDetails.appAccessGroup?.isAdministrator;
      if (isAdmin) {
        navigate(`/agent/account/${agentId}/overview`);
      }
    }
  };

  const onPageChange = (page: any) => {
    const currentPage = page.selected + 1;
    setPaginationState((previousState) => {
      return { ...previousState, page: currentPage };
    });
    const params = createSearchParams({ page: currentPage });
    navigate(
      { pathname: window.location.pathname, search: `?${params}` },
      { replace: true }
    );
  };

  const onClickTableHeader = (event: any) => {
    const newSortObj = onChangeSortObj(event, sortState);
    setSortState({
      sortBy: newSortObj.sortBy,
      sortOn: newSortObj.sortOn,
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter: GetAgentOptions = {
      page: Number(params.get("page")) || currentPage,
      search: params.get("search") || null,
      metaData: {
        limit: Number(JSON.parse(params.get("metaData") || "{}")?.limit) || 0,
        offset: Number(JSON.parse(params.get("metaData") || "{}")?.offset) || 0,
        sortBy: params.get("sortBy") || null,
        sortOn: params.get("sortOn") || null,
      },
    };
    setFilterOptions((prevState) => {
      return { ...prevState, ...filter };
    });
  }, [location.pathname]);

  useEffect(() => {
    if (reRenderComponent) {
      let page = paginationState.page;
      if (filterOptions.page && filterOptions.page > 1) {
        page = filterOptions.page;
      }
      let offset = (page - 1) * paginationState.itemsPerPage;
      if (state.agentsCount > 0 && offset > state.agentsCount) {
        const lastPage = Math.ceil(
          state.agentsCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetAgentOptions = {
        appAccessGroupId: filterOptions.appAccessGroupId,
        search: filterOptions.search,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppAgents({
        ...filter,
        metaData: metaData,
      });
      filter = { ...filter, metaData: metaData };
      const params = getUrlParamString(filter);
      navigate(`?${params}`, { replace: true });
      if (metaData?.offset && metaData?.limit) {
        const currentPageNum = Math.floor(metaData.offset / metaData.limit) + 1;
        setCurrentPage(currentPageNum);
      }
      MenuComponent.reinitialization();
    }
  }, [
    paginationState.page,
    paginationState.itemsPerPage,
    sortState.sortOn,
    sortState.sortBy,
    filterOptions.appAccessGroupId,
    filterOptions.search,
    filterOptions.page,
    reRenderComponent,
  ]);

  const forceLogoutAgent = async (agentId: string) => {
    const request = await AuthService.forceLogout([agentId]);
    if ("data" in request) {
      showToast(request.data.message, "success");
    }
  };

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  return (
    <BlockUI blocking={loading} className="overlay" loader={<BlockUiDesign />}>
      <div className="card">
        <div className="card-header py-5">
          <div className="card-title">
            <select
              className="form-select form-select-solid fw-bold w-auto w-lg-150px"
              data-kt-select2="true"
              data-placeholder="Show records"
              defaultValue={10}
              onChange={(e: any) => {
                setPaginationState((prevState) => {
                  return {
                    ...prevState,
                    itemsPerPage: Number(e.target.value),
                  };
                });
                getAppAgents({ metaData: { limit: e.target.value } });
              }}
            >
              <option value="10">10 Records</option>
              <option value="15">15 Records</option>
              <option value="25">25 Records</option>
              <option value="50">50 Records</option>
            </select>
          </div>
          <div className="card-toolbar">
            <div
              className="d-flex justify-content-end"
              data-kt-customer-table-toolbar="base"
            >
              <button
                type="button"
                className="btn btn-light-primary me-3"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                Filter
              </button>
              <AgentFilterDropdown setFilterOptions={setFilterOptions} />
              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Agent
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="agent_table"
          >
            <thead>
              <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th
                  id="_id"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "_id" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "_id" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  ID
                </th>
                <th
                  id="username"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-150px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "username" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "username" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Name
                </th>
                <th
                  id="appAccessGroupId"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "appAccessGroupId" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "appAccessGroupId" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Access Group
                </th>
                <th id="lastLoggedIn" className={"min-w-100px text-center"}>
                  Last Logged In
                </th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appAgents?.map((agent) => {
                return (
                  <tr key={agent.appAgentId}>
                    <td className="cursor-pointer">
                      <CopyToClipboard
                        onCopy={(text, result) => {
                          result &&
                            showToast("ID copied to clipboard", "success");
                        }}
                        text={agent.appAgentId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${agent.appAgentId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-250px text-truncate">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                          <a href="#">
                            <div className="symbol-label">
                              <Avatar
                                name={agent?.username}
                                alt={agent?.username}
                                size={"40px"}
                                round={true}
                              />
                            </div>
                          </a>
                          {connectedAgents.some(
                            (connectedAgent) =>
                              connectedAgent.appAgentId === agent.appAgentId
                          ) && (
                            <div className="position-absolute translate-middle bottom-0 start-75 bg-success rounded-circle border border-1 border-body h-10px w-10px"></div>
                          )}
                        </div>
                        <div className="d-flex flex-column">
                          <a
                            href="#"
                            className="text-gray-800 text-hover-primary mb-1"
                          >
                            {agent.username}
                          </a>
                          <span>{agent.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {agent?.appAccessGroup?.name}
                      </span>
                    </td>
                    <td className="mw-100px text-center">
                      <span
                        className={clsx(
                          "badge badge-light badge-sm badge-inline badge-light-info px-2"
                        )}
                      >
                        {agent.lastLoggedIn}
                      </span>
                    </td>
                    <td className="text-end">
                      <a
                        className="btn btn-light btn-active-light-primary btn-sm"
                        data-kt-menu-trigger="click"
                        data-kt-menu-placement="bottom-end"
                      >
                        Actions
                        <i className="fa-solid fa-chevron-down ms-3"></i>
                      </a>
                      <div
                        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
                        data-kt-menu="true"
                      >
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => {
                              viewAgent(agent.appAgentId || "");
                            }}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => {
                              forceLogoutAgent(agent.appAgentId || "");
                            }}
                          >
                            Force Logout
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-5">
            <PaginationComponent
              onPageChange={onPageChange}
              pageCount={Math.ceil(
                state.agentsCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.agentsCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
