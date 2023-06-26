/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import { FC, ReactNode, useEffect, useState } from "react";
import BlockUI from "@availity/block-ui";

import CopyToClipboard from "react-copy-to-clipboard";
import { format } from "date-fns";
import {
  CURRENT_PAGE,
  IST_DATE_FORMAT,
  getRequestMethodColor,
  getStatusCodeColor,
  onChangeSortObj,
  sortObj,
} from "../../../common/globals/common.constants";
import { PaginationComponent } from "../../../common/components/pagination/PaginationComponent";
import { showToast } from "../../../common/toastify/toastify.config";
import { BlockUiDesign } from "../../../common/components/blockUiDesign/BlockUiDesign";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { useParams, useSearchParams } from "react-router-dom";
import { SocketService } from "../../../common/services/socket.service";
import {
  AppActivity,
  GetAppActivityOptions,
} from "../../agents/models/app_agent.model";
import { AppAgentService } from "../../agents/services/app_agent.service";
import { ActivityFilterDropdown } from "./ActivityFilterDropdown";

export const AppActivityTable: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [agentId, setAgentId] = useState("");
  const params: any = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [state, setState] = useState<{
    appActivity: AppActivity[];
    activityCount: number;
  }>({
    appActivity: [],
    activityCount: 0,
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

  const [filterOptions, setFilterOptions] = useState<GetAppActivityOptions>({
    appActivityId: null,
    appAgentId: null,
    search: null,
  });

  useEffect(() => {
    if (SocketService.socket?.active) {
      SocketService.socket.on("appActivity", (data: AppActivity) => {
        console.log(data);
        if (data.appAgentId === agentId) {
          setState((previousState) => {
            const activities = previousState.appActivity;
            if (activities.length > 10) {
              activities.pop();
            }
            activities.unshift(data);
            previousState = { ...previousState, appActivity: activities };
            return previousState;
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    setAgentId(params?.appAgentId);
    setFilterOptions((prevState) => {
      return { ...prevState, appAgentId: params?.appAgentId };
    });
  }, [params?.appAgentId]);

  const getAppActivities = async (options?: GetAppActivityOptions) => {
    setLoading(true);
    const request = await AppAgentService.getAppActivities(options);
    const response = request;
    if ("data" in response && "message" in response.data) {
      const totalRecords = response.data.metaData.total_records || 0;
      setState((previousState) => {
        return {
          ...previousState,
          appActivity: response.data.appActivities,
          activityCount: totalRecords,
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
    }
  };

  const onPageChange = (page: any) => {
    const currentPage = page.selected + 1;
    setPaginationState((previousState) => {
      return { ...previousState, page: currentPage };
    });
  };

  const onClickTableHeader = (event: any) => {
    const newSortObj = onChangeSortObj(event, sortState);
    setSortState({
      sortBy: newSortObj.sortBy,
      sortOn: newSortObj.sortOn,
    });
  };

  useEffect(() => {
    let page = paginationState.page;
    if (filterOptions.page && filterOptions.page > 1) {
      page = filterOptions.page;
    }
    let offset = (page - 1) * paginationState.itemsPerPage;
    if (state.activityCount > 0 && offset > state.activityCount) {
      const lastPage = Math.ceil(
        state.activityCount / paginationState.itemsPerPage
      );
      offset = (lastPage - 1) * paginationState.itemsPerPage;
      setCurrentPage(lastPage);
    } else {
      setCurrentPage(page);
    }
    const filter: GetAppActivityOptions = {
      appAgentId: filterOptions.appAgentId,
      search: filterOptions.search,
    };
    getAppActivities({
      ...filter,
      metaData: {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      },
    });
    MenuComponent.reinitialization();
  }, [
    paginationState.page,
    paginationState.itemsPerPage,
    sortState.sortOn,
    sortState.sortBy,
    filterOptions.search,
    filterOptions.appAgentId,
    filterOptions.page,
    agentId,
  ]);

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
                getAppActivities({ metaData: { limit: e.target.value } });
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
                className="btn btn-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                Filter
              </button>
              <ActivityFilterDropdown setFilterOptions={setFilterOptions} />
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
                <th className={clsx("min-w-250px table-sort cursor-pointer")}>
                  Path
                </th>
                <th className="text-center min-w-150px">MetaData</th>
                <th className="text-center min-w-100px">Created At</th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appActivity?.map((activity) => {
                return (
                  <tr key={activity.appActivityId}>
                    <td className="cursor-pointer">
                      <CopyToClipboard
                        onCopy={(text, result) => {
                          result &&
                            showToast("ID copied to clipboard", "success");
                        }}
                        text={activity.appActivityId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${activity.appActivityId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-250px text-truncate">
                      <a
                        className="text-gray-800 fw-bold fs-6"
                        style={{ fontFamily: "monospace" }}
                      >
                        {activity?.activityDetails.request.originalUrl}
                      </a>
                    </td>
                    <td className="mw-150px text-center text-truncate">
                      <span
                        className={`me-2 badge badge-sm px-2 badge-light-${getRequestMethodColor(
                          activity?.activityDetails.request.method
                            ? activity?.activityDetails.request.method
                            : ""
                        )} badge-inline`}
                      >
                        {activity?.activityDetails.request.method}
                      </span>
                      <span
                        className={`me-2 badge badge-sm px-2 badge-light-${getStatusCodeColor(
                          activity?.activityDetails.response.statusCode
                            ? activity?.activityDetails.response.statusCode
                            : 0
                        )} badge-inline`}
                      >
                        {`${activity?.activityDetails.response.statusCode}`}
                      </span>
                      <span className="badge badge-light-dark text-gray-700">
                        <i className="fa-regular fa-hourglass-half me-2 fs-9"></i>
                        {activity?.activityDetails.processingTime}ms
                      </span>
                    </td>
                    <td className="mw-100px fw-bold text-center">
                      <span>
                        {activity?.createdAt
                          ? format(
                              new Date(activity?.createdAt),
                              IST_DATE_FORMAT
                            )
                          : ("" as ReactNode)}
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
                          <a className="menu-link px-3" onClick={() => {}}>
                            View
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
                state.activityCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.activityCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
