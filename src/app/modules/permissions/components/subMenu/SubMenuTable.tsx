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
import { AppMenuModel } from "../../models/app_menu.model";
import {
  AppSubMenuModel,
  GetSubMenuOptions,
} from "../../models/app_sub_menu.model";
import { AppSubMenuService } from "../../services/app_sub_menu.service";
import { SubMenuFilterDropdown } from "./SubMenuFilterDropdown";
import { MetaData } from "../../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    appMenu: AppMenuModel | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AppSubMenusTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState<{
    appSubMenus: AppSubMenuModel[];
    subMenusCount: number;
  }>({ appSubMenus: [], subMenusCount: 0 });

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
  const [checkedSubMenus, setCheckedSubMenus] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<GetSubMenuOptions>({
    appMenuId: null,
    search: null,
    appSubMenuId: null,
  });

  const [currentPage, setCurrentPage] = useState(paginationState.page);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedSubMenus(
        checked
          ? state.appSubMenus?.map((subMenu) => subMenu.appSubMenuId || "")
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedSubMenus((prevCheckedMenu) =>
        checked
          ? [...prevCheckedMenu, id]
          : prevCheckedMenu.filter((subMenuId) => subMenuId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const deleteSubMenu = (subMenu: AppSubMenuModel) => {
    handleAlert(
      `Are you sure?`,
      `Delete this menu: ${subMenu.name}?`,
      "question",
      "Confirm",
      async () => {
        const request = await AppSubMenuService.deleteSubMenu([
          subMenu.appSubMenuId || "",
        ]);
        if ("data" in request) {
          getAppSubMenus({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedSubMenus([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const onClickDelete = () => {
    handleAlert(
      `Please confirm this action. Total ${checkedSubMenus.length} record${
        checkedSubMenus.length > 1 ? "s" : ""
      } will be deleted.`,
      "question",
      "question",
      "Confirm",
      async () => {
        const request = await AppSubMenuService.deleteSubMenu(checkedSubMenus);
        if ("data" in request) {
          getAppSubMenus({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedSubMenus([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getAppSubMenus = async (options?: GetSubMenuOptions) => {
    try {
      setLoading(true);
      const request = await AppSubMenuService.getSubMenu(options);
      const response = request;
      if ("data" in response && "message" in response.data) {
        const totalRecords = response.data.metaData.total_records;
        setState((previousState) => {
          return {
            ...previousState,
            appSubMenus: response.data.appSubMenus,
            subMenusCount: totalRecords || 0,
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
    const filter: GetSubMenuOptions = {
      appMenuId: params.get("appMenuId") || null,
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
      if (state.subMenusCount > 0 && offset > state.subMenusCount) {
        const lastPage = Math.ceil(
          state.subMenusCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetSubMenuOptions = {
        appMenuId: filterOptions.appMenuId,
        appSubMenuId: filterOptions.appSubMenuId,
        search: filterOptions.search,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppSubMenus({
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
    filterOptions.appMenuId,
    filterOptions.metaData,
    filterOptions.search,
    filterOptions.appSubMenuId,
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
              {checkedSubMenus?.length > 0 ? (
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
                  <SubMenuFilterDropdown setFilterOptions={setFilterOptions} />
                </>
              )}

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Sub Menu
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_sub_menu_table"
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
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-end pe-5 min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appSubMenus?.map((subMenu) => {
                return (
                  <tr key={subMenu.appSubMenuId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={subMenu.appSubMenuId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedSubMenus.includes(
                            subMenu.appSubMenuId || ""
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
                        text={subMenu.appMenuId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${subMenu.appMenuId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-125px text-truncate">
                      <span className="text-gray-800 text-hover-primary mb-1">
                        {subMenu.name}
                      </span>
                    </td>
                    <td className="mw-175px text-truncate">
                      <span className="text-gray-800 text-hover-primary mb-1">
                        {subMenu.description}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {subMenu.createdAt
                          ? format(
                              new Date(subMenu?.createdAt),
                              IST_DATE_FORMAT
                            )
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
                            onClick={() => openModal("view", subMenu)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("edit", subMenu)}
                          >
                            Edit
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3 text-danger"
                            onClick={() => deleteSubMenu(subMenu)}
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
                state.subMenusCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.subMenusCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
