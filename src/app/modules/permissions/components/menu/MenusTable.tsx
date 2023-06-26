/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import clsx from "clsx";
import React, { FC, ReactNode, useEffect, useState } from "react";
import BlockUI from "@availity/block-ui";
import { BlockUiDesign } from "../../../../common/components/blockUiDesign/BlockUiDesign";
import { showToast } from "../../../../common/toastify/toastify.config";
import { handleAlert } from "../../../../common/components/sweetAlert/AlertComponent";
import { PaginationComponent } from "../../../../common/components/pagination/PaginationComponent";
import {
  CURRENT_PAGE,
  IST_DATE_FORMAT,
  getMetaDataValues,
  getUrlParamString,
  onChangeSortObj,
  sortObj,
} from "../../../../common/globals/common.constants";
import { format } from "date-fns";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import CopyToClipboard from "react-copy-to-clipboard";
import { AppMenuModel, GetMenuOptions } from "../../models/app_menu.model";
import { AppMenuService } from "../../services/app_menu.service";
import { MenuFilterDropdown } from "./MenuFilterDropdown";
import { MetaData } from "../../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    appMenu: AppMenuModel | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AppMenusTable: FC<Props> = ({ openModal, reRenderComponent }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<{
    appMenus: AppMenuModel[];
    menusCount: number;
  }>({ appMenus: [], menusCount: 0 });

  const [paginationState, setPaginationState] = useState({
    itemsPerPage: 10,
    showingFrom: 1,
    showingTill: 10,
    page: page ? page : CURRENT_PAGE,
  });
  const [sortState, setSortState] = useState<sortObj>({
    sortBy: null,
    sortOn: null,
  });
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedMenus, setCheckedMenus] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<GetMenuOptions>({
    appAccessGroupIds: [],
    appMenuId: null,
    checkAppAccessGroupIds: [],
    hasSubMenus: null,
    search: null,
  });

  const [currentPage, setCurrentPage] = useState(paginationState.page);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedMenus(
        checked ? state.appMenus?.map((menu) => menu.appMenuId || "") : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedMenus((prevCheckedMenu) =>
        checked
          ? [...prevCheckedMenu, id]
          : prevCheckedMenu.filter((menuId) => menuId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const deleteAppMenu = (menu: AppMenuModel) => {
    handleAlert(
      `Are you sure?`,
      `Delete this menu: ${menu.name}?`,
      "question",
      "Confirm",
      async () => {
        const request = await AppMenuService.deleteAppMenu([
          menu.appMenuId || "",
        ]);
        if ("data" in request) {
          getAppMenus({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedMenus([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const onClickDelete = () => {
    handleAlert(
      `Please confirm this action. Total ${checkedMenus.length} record${
        checkedMenus.length > 1 ? "s" : ""
      } will be deleted.`,
      "question",
      "question",
      "Confirm",
      async () => {
        const request = await AppMenuService.deleteAppMenu(checkedMenus);
        if ("data" in request) {
          getAppMenus({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedMenus([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getAppMenus = async (options?: GetMenuOptions) => {
    try {
      setLoading(true);
      const request = await AppMenuService.getAppMenus(options);
      const response = request;
      if ("data" in response && "message" in response.data) {
        const totalRecords = response.data.metaData.total_records;
        setState((previousState) => {
          return {
            ...previousState,
            appMenus: response.data.appMenus,
            menusCount: totalRecords || 0,
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
    const filter: GetMenuOptions = {
      appAccessGroupIds: JSON.parse(params.get("appAccessGroupIds") || "[]"),
      search: params.get("search") || null,
      page: Number(params.get("page")) || currentPage,
      hasSubMenus: Boolean(params.get("hasSubMenus")) || null,
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
      if (state.menusCount > 0 && offset > state.menusCount) {
        const lastPage = Math.ceil(
          state.menusCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetMenuOptions = {
        appAccessGroupIds: filterOptions.appAccessGroupIds,
        appMenuId: filterOptions.appMenuId,
        checkAppAccessGroupIds: filterOptions.checkAppAccessGroupIds,
        search: filterOptions.search,
        hasSubMenus: filterOptions.hasSubMenus,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppMenus({
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
    filterOptions.appAccessGroupIds,
    filterOptions.appMenuId,
    filterOptions.metaData,
    filterOptions.search,
    filterOptions.hasSubMenus,
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
              {checkedMenus?.length > 0 ? (
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
                  <MenuFilterDropdown setFilterOptions={setFilterOptions} />
                </>
              )}

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Menu
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
                <th className={clsx("min-w-175px")}>Description</th>
                <th
                  id="hasSubMenus"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px text-center table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "hasSubMenus" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "hasSubMenus" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Sub-Menus
                </th>
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-end pe-5 min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appMenus?.map((menu, index) => {
                return (
                  <tr key={menu.appMenuId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={menu.appMenuId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedMenus.includes(menu.appMenuId || "")}
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
                        text={menu.appMenuId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${menu.appMenuId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-125px text-truncate">
                      <span className="text-gray-800 mb-1">{menu.name}</span>
                    </td>
                    <td className="mw-175px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {menu.description}
                      </span>
                    </td>
                    <td className="mw-75px text-center">
                      <span
                        className={clsx(
                          "badge badge-sm badge-inline px-2",
                          { "badge-light-success": menu.hasSubMenus },
                          { "badge-light-danger": !menu.hasSubMenus }
                        )}
                      >
                        {menu.hasSubMenus ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {menu.createdAt
                          ? format(new Date(menu?.createdAt), IST_DATE_FORMAT)
                          : ("" as ReactNode)}
                      </span>
                    </td>
                    <td className="text-end">
                      <a
                        className="btn btn-light btn-active-light-primary btn-sm"
                        data-kt-menu-trigger="hover"
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
                            onClick={() => openModal("view", menu)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("edit", menu)}
                          >
                            Edit
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3 text-danger"
                            onClick={() => deleteAppMenu(menu)}
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
                state.menusCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.menusCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
