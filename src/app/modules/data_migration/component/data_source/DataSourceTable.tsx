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
} from "../../../../common/globals/common.constants";
import { handleAlert } from "../../../../common/components/sweetAlert/AlertComponent";
import { showToast } from "../../../../common/toastify/toastify.config";
import { BlockUiDesign } from "../../../../common/components/blockUiDesign/BlockUiDesign";
import { PaginationComponent } from "../../../../common/components/pagination/PaginationComponent";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import {
  AppDataSource,
  GetDataSourceOptions,
} from "../../models/data_sources/app_datasource.model";
import { AppDataSourceService } from "../../services/data_sources/app_dataSource.service";
import { SourceFilterDropdown } from "./SourceFilterDropdown";
import { DataSourceLogsTable } from "./DataSourceLogsTable";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataSourceRecordTable } from "./DataSourceRecords";
import { MetaData } from "../../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    dataSourceDetails: AppDataSource | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AppDataSourceTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedDatasources, setCheckedDataSources] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [state, setState] = useState<{
    dataSources: AppDataSource[];
    datasourceCount: number;
  }>({
    dataSources: [],
    datasourceCount: 0,
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

  const [filterOptions, setFilterOptions] = useState<GetDataSourceOptions>({
    appDataSourceId: null,
    search: null,
    page: 1,
  });

  const [modalState, setmodalState] = useState<{
    showLogModal: boolean;
    dataSourceId: string;
    showRecordModal: boolean;
  }>({ dataSourceId: "", showLogModal: false, showRecordModal: false });

  const openLogsModal = (dataSourceId: string) =>
    setmodalState({
      showLogModal: true,
      dataSourceId: dataSourceId,
      showRecordModal: false,
    });
  const closeLogsModal = () =>
    setmodalState({
      showLogModal: false,
      dataSourceId: "",
      showRecordModal: false,
    });

  const openRecordModal = (dataSourceId: string) =>
    setmodalState({
      showRecordModal: true,
      dataSourceId: dataSourceId,
      showLogModal: false,
    });
  const closeRecordModal = () =>
    setmodalState({
      showLogModal: false,
      dataSourceId: "",
      showRecordModal: false,
    });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedDataSources(
        checked
          ? state.dataSources?.map(
              (dataSource) => dataSource.appDataSourceId || ""
            )
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedDataSources((prevCheckedDataSources) =>
        checked
          ? [...prevCheckedDataSources, id]
          : prevCheckedDataSources.filter((dataSourceId) => dataSourceId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const onClickDelete = () => {
    handleAlert(
      `Are you sure?`,
      `You won't be able to revert this! </br> Total ${
        checkedDatasources.length
      } record${checkedDatasources.length > 1 ? "s" : ""} will be deleted.`,
      "question",
      "Confirm",
      async () => {
        const request = await AppDataSourceService.deleteDataSource(
          checkedDatasources
        );
        if ("data" in request) {
          getAppDatasource({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedDataSources([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const deleteAppDatasource = (dataSource: AppDataSource) => {
    handleAlert(
      `Are you sure?`,
      `Delete this dataSource <br> ${dataSource.name}`,
      "question",
      "Confirm",
      async () => {
        const request = await AppDataSourceService.deleteDataSource([
          dataSource.appDataSourceId || "",
        ]);
        if ("data" in request) {
          getAppDatasource({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedDataSources([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getAppDatasource = async (options?: GetDataSourceOptions) => {
    try {
      setLoading(true);
      const request = await AppDataSourceService.getDataSource(options);
      const response = request;
      if ("data" in response && "message" in response.data) {
        const totalRecords = response.data.metaData.total_records || 0;
        setState((previousState) => {
          return {
            ...previousState,
            dataSources: response.data.appDataSources,
            datasourceCount: totalRecords,
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

  const onPageChange = (page: any) => {
    const currentPage = page.selected + 1;
    setPaginationState((previousState) => {
      return { ...previousState, page: currentPage };
    });
  };

  const executeDataSource = async (datasourceId: string) => {
    const request = await AppDataSourceService.executeDataSource(datasourceId);
    if ("data" in request) {
      showToast(request.data.message, "success");
    }
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
    const filter: GetDataSourceOptions = {
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
      if (state.datasourceCount > 0 && offset > state.datasourceCount) {
        const lastPage = Math.ceil(
          state.datasourceCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetDataSourceOptions = {
        appDataSourceId: filterOptions.appDataSourceId,
        search: filterOptions.search,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppDatasource({
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
  }, [
    paginationState.page,
    paginationState.itemsPerPage,
    sortState.sortOn,
    sortState.sortBy,
    filterOptions.appDataSourceId,
    filterOptions.search,
    filterOptions.page,
    reRenderComponent,
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
                getAppDatasource({ metaData: { limit: e.target.value } });
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
              {checkedDatasources?.length > 0 ? (
                <button
                  type="button"
                  className="btn btn-light-danger me-3"
                  onClick={onClickDelete}
                >
                  Delete
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-light-primary me-3"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="top-end"
                  >
                    <i className="fs-5 pe-2 fa-solid fa-filter"></i>Filter
                  </button>
                  <SourceFilterDropdown setFilterOptions={setFilterOptions} />
                </>
              )}

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Data Source
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_service_dataSource_table"
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
                  id="appDataSourceId"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "appDataSourceId" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "appDataSourceId" &&
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
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.dataSources?.map((dataSource) => {
                return (
                  <tr key={dataSource.appDataSourceId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={dataSource.appDataSourceId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedDatasources.includes(
                            dataSource.appDataSourceId || ""
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
                        text={dataSource.appDataSourceId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${dataSource.appDataSourceId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {dataSource.name}
                      </span>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {dataSource.description}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {dataSource?.createdAt
                          ? format(
                              new Date(dataSource?.createdAt),
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
                            onClick={() => openModal("view", dataSource)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("edit", dataSource)}
                          >
                            Edit
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              executeDataSource(
                                dataSource.appDataSourceId || ""
                              )
                            }
                          >
                            Execute
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              openLogsModal(dataSource.appDataSourceId || "")
                            }
                          >
                            Logs
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              openRecordModal(dataSource.appDataSourceId || "")
                            }
                          >
                            Records
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3 text-danger"
                            onClick={() => deleteAppDatasource(dataSource)}
                          >
                            Delete
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
                state.datasourceCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.datasourceCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
      <DataSourceLogsTable
        closeModal={closeLogsModal}
        dataSourceId={modalState.dataSourceId}
        showModal={modalState.showLogModal}
      />
      <DataSourceRecordTable
        closeModal={closeRecordModal}
        dataSourceId={modalState.dataSourceId}
        showModal={modalState.showRecordModal}
      />
    </BlockUI>
  );
};
