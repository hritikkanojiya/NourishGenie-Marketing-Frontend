/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import clsx from "clsx";
import React, { FC, ReactNode, useEffect, useState } from "react";
import BlockUI from "@availity/block-ui";

import CopyToClipboard from "react-copy-to-clipboard";
import { format } from "date-fns";
import {
  CURRENT_PAGE,
  IST_DATE_FORMAT,
  getMetaDataValues,
  getUrlParamString,
  onChangeSortObj,
  sortObj,
} from "../../../common/globals/common.constants";
import { PaginationComponent } from "../../../common/components/pagination/PaginationComponent";
import { showToast } from "../../../common/toastify/toastify.config";
import { BlockUiDesign } from "../../../common/components/blockUiDesign/BlockUiDesign";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { AppCampaign, GetCampaignsOptions } from "../models/campaign.model";
import { AppCampaignService } from "../services/campaign.service";
import { TestCampaignModal } from "./TestCampaign";
import { ScheduleCampaignModal } from "./ScheduleCampaign";
import { AppCampaignFilterDropdown } from "./CampaignFilterDropdown";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MetaData } from "../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "view",
    appCampaignDetails: AppCampaign | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AppCampaignsTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedConstants, setCheckedConstants] = useState<string[]>([]);
  const [modalState, setModalState] = useState({
    showTestModal: false,
    showScheduleModal: false,
    campaignId: "",
  });
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const openTestModal = (campaignId: string) =>
    setModalState({
      showScheduleModal: false,
      showTestModal: true,
      campaignId: campaignId,
    });
  const closeTestModal = () =>
    setModalState({
      showScheduleModal: false,
      showTestModal: false,
      campaignId: "",
    });

  const openScheduleModal = (campaignId: string) =>
    setModalState({
      showScheduleModal: true,
      showTestModal: false,
      campaignId: campaignId,
    });
  const closeScheduleModal = () =>
    setModalState({
      showScheduleModal: false,
      showTestModal: false,
      campaignId: "",
    });

  const [state, setState] = useState<{
    appCampiangs: AppCampaign[];
    campaignCount: number;
  }>({
    appCampiangs: [],
    campaignCount: 0,
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

  const [filterOptions, setFilterOptions] = useState<GetCampaignsOptions>({
    appCampaignId: null,
    search: null,
    page: 1,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedConstants(
        checked
          ? state.appCampiangs?.map((campaign) => campaign.appCampaignId || "")
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedConstants((prevcheckedConstants) =>
        checked
          ? [...prevcheckedConstants, id]
          : prevcheckedConstants.filter((campaignId) => campaignId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const getAppCampaigns = async (options?: GetCampaignsOptions) => {
    try {
      setLoading(true);
      const request = await AppCampaignService.getAppCampaigns(options);
      const response = request;
      if ("data" in response && "message" in response.data) {
        const totalRecords = response.data.metaData.total_records || 0;
        setState((previousState) => {
          return {
            ...previousState,
            appCampiangs: response.data.appCampaignDetails,
            campaignCount: totalRecords,
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
    } catch (error) {
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
    const params = new URLSearchParams(location.search);
    const filter: GetCampaignsOptions = {
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
      if (state.campaignCount > 0 && offset > state.campaignCount) {
        const lastPage = Math.ceil(
          state.campaignCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetCampaignsOptions = {
        appCampaignId: filterOptions.appCampaignId,
        search: filterOptions.search,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppCampaigns({
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
    }
    MenuComponent.reinitialization();
  }, [
    paginationState.page,
    paginationState.itemsPerPage,
    sortState.sortOn,
    sortState.sortBy,
    filterOptions.appCampaignId,
    filterOptions.search,
    filterOptions.page,
    reRenderComponent,
  ]);

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  return (
    <BlockUI blocking={loading} className="overlay" loader={<BlockUiDesign />}>
      <TestCampaignModal
        showModal={modalState.showTestModal}
        closeModal={closeTestModal}
        campaignId={modalState.campaignId}
      />
      <ScheduleCampaignModal
        showModal={modalState.showScheduleModal}
        closeModal={closeScheduleModal}
        campaignId={modalState.campaignId}
      />
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
                getAppCampaigns({ metaData: { limit: e.target.value } });
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
              <AppCampaignFilterDropdown setFilterOptions={setFilterOptions} />

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_service_campaign_table"
          >
            <thead>
              <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th className="w-10px pe-2">
                  <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                    <input
                      id="selectAll"
                      className="form-check-input"
                      type="checkbox"
                      value="selectAll"
                      checked={selectAllChecked}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </th>
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
                  id="name"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "name" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "name" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Name
                </th>
                <th
                  id="description"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "description" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "description" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  {" "}
                  Description
                </th>
                <th
                  onClick={onClickTableHeader}
                  className={clsx("min-w-125px table-sort cursor-pointer")}
                >
                  {" "}
                  Agent
                </th>
                <th
                  id="scheduledAt"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer text-center",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "scheduledAt" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "scheduledAt" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  {" "}
                  Scheduled
                </th>
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appCampiangs?.map((campaign) => {
                return (
                  <tr key={campaign.appCampaignId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={campaign.appCampaignId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedConstants.includes(
                            campaign.appCampaignId || ""
                          )}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </td>
                    <td className="cursor-pointer">
                      <CopyToClipboard
                        onCopy={(text, result) => {
                          result &&
                            showToast("ID copied to clipboard", "success");
                        }}
                        text={campaign.appCampaignId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${campaign.appCampaignId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {campaign.name}
                      </span>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {campaign.description}
                      </span>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {campaign.appAgentAccDetails.username}
                      </span>
                    </td>
                    <td className="mw-150px text-center">
                      <span
                        className={clsx(
                          "badge  text-hover-primary text-gray-700 mb-1",
                          {
                            "badge-light-success": campaign.scheduledAt,
                            "badge-light-danger": !campaign.scheduledAt,
                          }
                        )}
                      >
                        {campaign.scheduledAt ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {campaign?.createdAt
                          ? format(
                              new Date(campaign?.createdAt),
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
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("view", campaign)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              openScheduleModal(campaign.appCampaignId)
                            }
                          >
                            Schedule
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              openTestModal(campaign.appCampaignId)
                            }
                          >
                            Test
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
                state.campaignCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.campaignCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
