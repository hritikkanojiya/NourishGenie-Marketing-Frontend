/* eslint-disable no-script-url */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from "clsx";
import React, { FC, ReactNode, useEffect, useState } from "react";
import {
  GetRouteOptions,
  ServiceRoute,
} from "../../models/service_route.model";
import { ServiceRouteService } from "../../services/service_route.service";
import BlockUI from "@availity/block-ui";
import { BlockUiDesign } from "../../../../common/components/blockUiDesign/BlockUiDesign";
import { showToast } from "../../../../common/toastify/toastify.config";
import { handleAlert } from "../../../../common/components/sweetAlert/AlertComponent";
import { PaginationComponent } from "../../../../common/components/pagination/PaginationComponent";
import {
  getRequestMethodColor,
  onChangeSortObj,
  IST_DATE_FORMAT,
  sortObj,
  ITEMS_PER_PAGE,
  SHOWING_FROM,
  SHOWING_TILL,
  CURRENT_PAGE,
  getUrlParamString,
  getMetaDataValues,
} from "../../../../common/globals/common.constants";
import { RouteFilterDropDown } from "./RouteFilterDropdown";
import { format } from "date-fns";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { MetaData } from "../../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    routeDetails: ServiceRoute | {}
  ) => any;
  reRenderComponent: boolean;
};

export const ServiceRoutesTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedRoutes, setCheckedRoutes] = useState<string[]>([]);

  const [state, setState] = useState<{
    routeDetails: ServiceRoute[];
    routesCount: number;
  }>({ routeDetails: [], routesCount: 0 });

  const [paginationState, setPaginationState] = useState({
    itemsPerPage: ITEMS_PER_PAGE,
    showingFrom: SHOWING_FROM,
    showingTill: SHOWING_TILL,
    page: page ? page : CURRENT_PAGE,
  });

  const [currentPage, setCurrentPage] = useState(paginationState.page);

  const [sortState, setSortState] = useState<sortObj>({
    sortBy: null,
    sortOn: null,
  });

  const [filterOptions, setFilterOptions] = useState<GetRouteOptions>({
    appAccessGroupIds: [],
    appRouteId: null,
    method: null,
    search: null,
    secure: null,
    page: 1,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedRoutes(
        checked
          ? state.routeDetails?.map((route) => route.appRouteId || "")
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedRoutes((prevCheckedRoutes) =>
        checked
          ? [...prevCheckedRoutes, id]
          : prevCheckedRoutes.filter((routeId) => routeId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const deleteServiceRoute = (route: ServiceRoute) => {
    handleAlert(
      `Are you sure?`,
      `Delete this route <br> ${route.path}`,
      "question",
      "Confirm",
      async () => {
        const request = await ServiceRouteService.deleteServiceRoute([
          route.appRouteId || "",
        ]);
        if ("data" in request) {
          getServiceRoutes({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedRoutes([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const onClickDelete = () => {
    handleAlert(
      `Are you sure?`,
      `You won't be able to revert this! </br> Total ${
        checkedRoutes.length
      } record${checkedRoutes.length > 1 ? "s" : ""} will be deleted.`,
      "question",
      "Confirm",
      async () => {
        const request = await ServiceRouteService.deleteServiceRoute(
          checkedRoutes
        );
        if ("data" in request) {
          getServiceRoutes({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedRoutes([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getServiceRoutes = async (options?: GetRouteOptions) => {
    try {
      setLoading(true);
      const request = await ServiceRouteService.getServiceRoutes(options);
      const response = request;
      if ("data" in response && "message" in response.data) {
        const totalRecords = response.data.metaData.total_records || 0;
        setState((previousState) => {
          return {
            ...previousState,
            routeDetails: response.data.appRoutes,
            routesCount: totalRecords || 0,
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
    const filter: GetRouteOptions = {
      appAccessGroupIds: JSON.parse(params.get("appAccessGroupIds") || "[]"),
      method: params.get("method") || null,
      page: Number(params.get("page")) || currentPage,
      search: params.get("search") || null,
      secure: params.get("secure") || null,
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
      if (state.routesCount > 0 && offset > state.routesCount) {
        const lastPage = Math.ceil(
          state.routesCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetRouteOptions = {
        appAccessGroupIds: filterOptions.appAccessGroupIds,
        appRouteId: filterOptions.appRouteId,
        method: filterOptions.method,
        search: filterOptions.search,
        secure: filterOptions.secure,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getServiceRoutes({
        ...filter,
        metaData: metaData,
      });
      filter = {
        ...filter,
        metaData: metaData,
      };
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
    sortState.sortBy,
    sortState.sortOn,
    filterOptions.appAccessGroupIds,
    filterOptions.appRouteId,
    filterOptions.method,
    filterOptions.search,
    filterOptions.secure,
    filterOptions.page,
    reRenderComponent,
  ]);

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  return (
    <BlockUI blocking={loading} className="overlay " loader={<BlockUiDesign />}>
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
                getServiceRoutes({ metaData: { limit: e.target.value } });
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
              {checkedRoutes?.length > 0 ? (
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
                  <RouteFilterDropDown setFilterOptions={setFilterOptions} />
                </>
              )}

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Service Route
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_service_route_table"
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
                  id="path"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "path" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "path" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Path
                </th>
                <th
                  id="method"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px text-center table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "method" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "method" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  {" "}
                  Method
                </th>
                <th
                  id="secure"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px text-center table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "secure" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "secure" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Secure
                </th>
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-end pe-5 min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.routeDetails?.map((route, index) => (
                <tr key={route.appRouteId}>
                  <td>
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        id={route.appRouteId}
                        className="form-check-input selectBox"
                        type="checkbox"
                        checked={checkedRoutes.includes(route.appRouteId || "")}
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
                      text={route.appRouteId || ""}
                    >
                      <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                        {`${route.appRouteId?.substring(0, 10)}...`}
                      </span>
                    </CopyToClipboard>
                  </td>
                  <td className="mw-300px text-truncate">
                    <span className="text-gray-800 mb-1">{route.path}</span>
                  </td>
                  <td className="mw-75px text-center">
                    <span
                      className={`badge badge-sm px-2 badge-light-${getRequestMethodColor(
                        route.method ? route.method : ""
                      )} badge-inline`}
                    >
                      {route.method}
                    </span>
                  </td>
                  <td className="mw-75px text-center">
                    <span
                      className={clsx(
                        "badge badge-sm badge-inline px-2",
                        { "badge-light-success": route.secure },
                        { "badge-light-danger": !route.secure }
                      )}
                    >
                      {route.secure ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="mw-150px fw-bold text-center">
                    <span>
                      {route.createdAt
                        ? format(new Date(route?.createdAt), IST_DATE_FORMAT)
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
                          onClick={() => openModal("view", route)}
                        >
                          View
                        </a>
                      </div>
                      <div className="menu-item px-3">
                        <a
                          className="menu-link px-3"
                          onClick={() => openModal("edit", route)}
                        >
                          Edit
                        </a>
                      </div>
                      <div className="menu-item px-3">
                        <a
                          className="menu-link px-3 text-danger"
                          onClick={() => deleteServiceRoute(route)}
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-5">
            <PaginationComponent
              onPageChange={onPageChange}
              pageCount={Math.ceil(
                state.routesCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.routesCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
