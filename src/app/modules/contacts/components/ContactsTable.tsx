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
  AppContact,
  GetAppContactsOptions,
} from "../models/app_contacts.model";
import { AppContactService } from "../services/app_contact.service";
import { ToggleListModal } from "./ToggleListModal";
import { ImportContactModal } from "./ImportContactModal";
import { MenuComponent } from "../../../../_metronic/assets/ts/components/MenuComponent";
import { ContactFilterDropdown } from "./ContactFilterDropdown";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import { MetaData } from "../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    appConstantDetails: AppContact | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AppContactsTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedContacts, setCheckedContacts] = useState<string[]>([]);

  const [modalState, setModalState] = useState({
    showToggleModal: false,
    showImportModal: false,
    contactId: "",
  });

  const openToggleListModal = (contactId: string) =>
    setModalState((prevState) => {
      return { ...prevState, showToggleModal: true, contactId: contactId };
    });
  const closeToggleListModal = () =>
    setModalState((prevState) => {
      return { ...prevState, showToggleModal: false, contactId: "" };
    });
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const openImportModal = () =>
    setModalState((prevState) => {
      return { ...prevState, showImportModal: true };
    });
  const closeImportModal = () =>
    setModalState((prevState) => {
      return { ...prevState, showImportModal: false };
    });

  const [state, setState] = useState<{
    appContacts: AppContact[];
    contactCount: number;
  }>({
    appContacts: [],
    contactCount: 0,
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

  const [filterOptions, setFilterOptions] = useState<GetAppContactsOptions>({
    appContactId: null,
    ngUserId: null,
    search: null,
    sendInBlueContactId: null,
    page: 1,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedContacts(
        checked
          ? state.appContacts?.map((contact) => contact.appContactId || "")
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedContacts((prevcheckedContacts) =>
        checked
          ? [...prevcheckedContacts, id]
          : prevcheckedContacts.filter((contactId) => contactId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const onClickDelete = () => {
    handleAlert(
      `Are you sure?`,
      `You won't be able to revert this! </br> Total ${
        checkedContacts.length
      } record${checkedContacts.length > 1 ? "s" : ""} will be deleted.`,
      "question",
      "Confirm",
      async () => {
        const request = await AppContactService.deleteAppContacts(
          checkedContacts
        );
        if ("data" in request) {
          getAppContacts({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedContacts([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const deleteAppContacts = (contact: AppContact) => {
    handleAlert(
      `Are you sure?`,
      `Delete this contact <br> ${contact.email}`,
      "question",
      "Confirm",
      async () => {
        const request = await AppContactService.deleteAppContacts([
          contact.appContactId || "",
        ]);
        if ("data" in request) {
          getAppContacts({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedContacts([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getAppContacts = async (options?: GetAppContactsOptions) => {
    try {
      setLoading(true);
      const request = await AppContactService.getAppContacts(options);
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
            appContacts: response.data.appContacts,
            contactCount: totalRecords,
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
    const filter: GetAppContactsOptions = {
      ngUserId: Number(params.get("ngUserId")) || null,
      sendInBlueContactId: Number(params.get("sendInBlueContactId")) || null,
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
      if (state.contactCount > 0 && offset > state.contactCount) {
        const lastPage = Math.ceil(
          state.contactCount / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetAppContactsOptions = {
        appContactId: filterOptions.appContactId,
        search: filterOptions.search,
        ngUserId: filterOptions.ngUserId,
        sendInBlueContactId: filterOptions.sendInBlueContactId,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAppContacts({
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
    filterOptions.appContactId,
    filterOptions.ngUserId,
    filterOptions.search,
    filterOptions.sendInBlueContactId,
    filterOptions.search,
    filterOptions.page,
    reRenderComponent,
  ]);

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  return (
    <BlockUI blocking={loading} className="overlay" loader={<BlockUiDesign />}>
      <ToggleListModal
        closeModal={closeToggleListModal}
        showModal={modalState.showToggleModal}
        contactId={modalState.contactId}
      />
      <ImportContactModal
        closeModal={closeImportModal}
        showModal={modalState.showImportModal}
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
                getAppContacts({ metaData: { limit: e.target.value } });
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
              className="d-flex justify-content-between"
              data-kt-customer-table-toolbar="base"
            >
              {checkedContacts?.length > 0 ? (
                <button
                  type="button"
                  className="btn btn-light-danger mx-2"
                  onClick={onClickDelete}
                >
                  Delete
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-light-primary mx-2"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                    data-kt-menu-flip="top-end"
                  >
                    Filter
                  </button>
                  <ContactFilterDropdown setFilterOptions={setFilterOptions} />
                </>
              )}
              <button
                onClick={openImportModal}
                type="button"
                className="btn btn-primary mx-2"
              >
                Import Contacts
              </button>
              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary mx-2"
              >
                Create Contact
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_service_contact_table"
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
                  id="firstName"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "firstName" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "firstName" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  Name
                </th>
                <th
                  id="mobile"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-125px table-sort cursor-pointer text-center",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "mobile" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "mobile" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  {" "}
                  Mobile
                </th>
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.appContacts?.map((contact) => {
                return (
                  <tr key={contact.appContactId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={contact.appContactId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedContacts.includes(
                            contact.appContactId || ""
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
                        text={contact.appContactId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${contact.appContactId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-250px text-truncate">
                      <div className="d-flex align-items-center">
                        <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                          <a href="#">
                            <div className="symbol-label">
                              <Avatar
                                name={`${contact.firstName} ${contact.lastName}`}
                                alt={`${contact.firstName} ${contact.lastName}`}
                                size={"40px"}
                                round={true}
                              />
                            </div>
                          </a>
                        </div>
                        <div className="d-flex flex-column">
                          <a
                            href="#"
                            className="text-gray-800 text-hover-primary mb-1"
                          >
                            {`${contact.firstName} ${contact.lastName}`}
                          </a>
                          <span>{contact.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="mw-150px text-center">
                      <span
                        className={clsx(
                          "badge badge-sm badge-light-success mb-1"
                        )}
                      >
                        {contact.mobile}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {contact?.createdAt
                          ? format(
                              new Date(contact?.createdAt),
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
                            onClick={() => openModal("view", contact)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("edit", contact)}
                          >
                            Edit
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              openToggleListModal(contact.appContactId)
                            }
                          >
                            Toggle
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3 text-danger"
                            onClick={() => deleteAppContacts(contact)}
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
                state.contactCount / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.contactCount}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </BlockUI>
  );
};
