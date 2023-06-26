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
import { handleAlert } from "../../../common/components/sweetAlert/AlertComponent";
import {
  AppParameter,
  GetAppParameterOptions,
} from "../models/app_parameter.model";
import { AppParameterService } from "../services/app_parameter.service";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { ParameterFilterDropdown } from "./ParameterFilterDropdown";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MetaData } from "../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    appParameterDetails: AppParameter | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AppParametersTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedParameters, setCheckedParameters] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [state, setState] = useState<{
    appParameters: AppParameter[];
    parameterCount: number;
  }>({
    appParameters: [],
    parameterCount: 0,
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

  const [filterOptions, setFilterOptions] = useState<GetAppParameterOptions>({
    appParameterId: null,
    category: null,
    search: null,
    type: null,
    page: 1,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedParameters(
        checked
          ? state.appParameters?.map(
              (constant) => constant.appParameterId || ""
            )
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedParameters((prevcheckedParameters) =>
        checked
          ? [...prevcheckedParameters, id]
          : prevcheckedParameters.filter((constantId) => constantId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const onClickDelete = () => {
    handleAlert(
      `Are you sure?`,
      `You won't be able to revert this! </br> Total ${
        checkedParameters.length
      } record${checkedParameters.length > 1 ? "s" : ""} will be deleted.`,
      "question",
      "Confirm",
      async () => {
        const request = await AppParameterService.deleteAppParameters(
          checkedParameters
        );
        if ("data" in request) {
          getAppParameters({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedParameters([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const deleteAppParameters = (parameter: AppParameter) => {
    handleAlert(
      `Are you sure?`,
      `Delete this parameter <br> ${parameter.name}`,
      "question",
      "Confirm",
      async () => {
        const request = await AppParameterService.deleteAppParameters([
          parameter.appParameterId || "",
        ]);
        if ("data" in request) {
          getAppParameters({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedParameters([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getAppParameters = async (options?: GetAppParameterOptions) => {
    try {
      setLoading(true);
      const request = await AppParameterService.getAppParameters(options);
      const response = request;
      if ("data" in response && "message" in response.data) {
        const totalRecords = response.data.metaData.total_records || 0;
        setState((previousState) => {
          return {
            ...previousState,
            appParameters: response.data.appParameters,
            parameterCount: totalRecords,
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

  const onClickTableHeader = (event: any) => {
    const newSortObj = onChangeSortObj(event, sortState);
    setSortState({
      sortBy: newSortObj.sortBy,
      sortOn: newSortObj.sortOn,
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filter: GetAppParameterOptions = {
      category: params.get("category") || null,
      type: params.get("type") || null,
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
      if (state.parameterCount > 0 && offset > state.parameterCount) {
        const lastPage = Math.ceil(
          state.parameterCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetAppParameterOptions = {
        appParameterId: filterOptions.appParameterId,
        category: filterOptions.category,
        search: filterOptions.search,
        type: filterOptions.type,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppParameters({
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
    filterOptions.appParameterId,
    filterOptions.category,
    filterOptions.type,
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
                getAppParameters({ metaData: { limit: e.target.value } });
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
              {checkedParameters?.length > 0 ? (
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
                  <ParameterFilterDropdown
                    setFilterOptions={setFilterOptions}
                  />
                </>
              )}

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Parameter
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_service_parameter_table"
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
                  id="config.category"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px table-sort cursor-pointer text-center",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "config.category" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "config.category" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  {" "}
                  Category
                </th>
                <th
                  id="config.type"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px table-sort cursor-pointer text-center",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "config.type" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "config.type" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  {" "}
                  Type
                </th>
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appParameters?.map((parameter) => {
                return (
                  <tr key={parameter.appParameterId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={parameter.appParameterId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedParameters.includes(
                            parameter.appParameterId || ""
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
                        text={parameter.appParameterId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary mb-1">
                          {`${parameter.appParameterId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-150px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {parameter.name}
                      </span>
                    </td>
                    <td className="mw-75px text-center">
                      <span
                        className={clsx(
                          "badge badge-sm mb-1",
                          {
                            "badge-light-primary":
                              parameter.config.category === "CONTACT",
                          },
                          {
                            "badge-light-info":
                              parameter.config.category === "MARKETING",
                          }
                        )}
                      >
                        {parameter.config.category}
                      </span>
                    </td>
                    <td className="mw-75px text-center">
                      <span
                        className={clsx(
                          "badge badge-sm mb-1",
                          {
                            "badge-light-success":
                              parameter.config.type === "STATIC",
                          },
                          {
                            "badge-light-warning":
                              parameter.config.type === "DYNAMIC",
                          },
                          {
                            "badge-light-danger":
                              parameter.config.category === "CONTACT" &&
                              parameter.config.type === "STATIC",
                          }
                        )}
                      >
                        {parameter.config.category === "CONTACT"
                          ? "NA"
                          : parameter.config.type}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {parameter?.createdAt
                          ? format(
                              new Date(parameter?.createdAt),
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
                            onClick={() => openModal("view", parameter)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("edit", parameter)}
                          >
                            Edit
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3 text-danger"
                            onClick={() => deleteAppParameters(parameter)}
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
                state.parameterCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.parameterCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
