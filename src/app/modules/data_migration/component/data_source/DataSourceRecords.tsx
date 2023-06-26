/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { showToast } from "../../../../common/toastify/toastify.config";
import { PaginationComponent } from "../../../../common/components/pagination/PaginationComponent";
import {
  CURRENT_PAGE,
  onChangeSortObj,
  sortObj,
} from "../../../../common/globals/common.constants";
import CopyToClipboard from "react-copy-to-clipboard";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { AppDataSourceService } from "../../services/data_sources/app_dataSource.service";
import { useSearchParams } from "react-router-dom";
import {
  DataSourceRecord,
  GetDataSourceRecordOptions,
} from "../../models/data_sources/app_datasource.model";
import { DataSourceRecordModal } from "./DataSourceRecordsModal";
import { handleAlert } from "../../../../common/components/sweetAlert/AlertComponent";
import { SkipDataSourcePayload } from "../../models/data_sources/app_datasource.model";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components";
import Avatar from "react-avatar";

type Props = {
  closeModal: () => void;
  showModal: boolean;
  dataSourceId: string | null;
};

export const DataSourceRecordTable: FC<Props> = ({
  closeModal,
  showModal,
  dataSourceId,
}) => {
  const [recordsModalState, setrecordsModalState] = useState<{
    showModal: boolean;
    record: DataSourceRecord | {};
  }>({ record: {}, showModal: false });
  const [searchParams] = useSearchParams();
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedRecords, setCheckedRecords] = useState<string[]>([]);
  const page = Number(searchParams.get("page"));

  const openrecordsModal = (record: DataSourceRecord) =>
    setrecordsModalState((prevState) => {
      return { ...prevState, showModal: true, record: record };
    });
  const closerecordsModal = () =>
    setrecordsModalState((prevState) => {
      return { ...prevState, showModal: false };
    });

  const [state, setState] = useState<{
    DataSourceRecord: DataSourceRecord[];
    recordCounts: number;
  }>({
    DataSourceRecord: [],
    recordCounts: 0,
  });

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

  const getDataSourceRecord = async (options?: GetDataSourceRecordOptions) => {
    const request = await AppDataSourceService.getDataSourceRecords(options);
    const response = request;
    if ("data" in response && "message" in response.data) {
      const totalRecords = response.data.metaData.total_records || 0;
      setState((previousState) => {
        return {
          ...previousState,
          DataSourceRecord: response.data.appDataSourceRecords,
          recordCounts: totalRecords,
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
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedRecords(
        checked
          ? state.DataSourceRecord?.map(
              (record) => record.appDataSourceRecordId || ""
            )
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedRecords((prevCheckedRecords) =>
        checked
          ? [...prevCheckedRecords, id]
          : prevCheckedRecords.filter((dataSourceId) => dataSourceId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const onClickDelete = () => {
    handleAlert(
      `Are you sure?`,
      `You won't be able to revert this! </br> Total ${
        checkedRecords.length
      } record${checkedRecords.length > 1 ? "s" : ""} will be deleted.`,
      "question",
      "Confirm",
      async () => {
        const request = await AppDataSourceService.deleteDataSourceRecords({
          appDataSourceId: dataSourceId || "",
          appDataSourceRecordIds: checkedRecords,
        });
        if ("data" in request) {
          getDataSourceRecord({
            appDataSourceId: dataSourceId,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedRecords([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const deleteDataSourceRecord = (record: DataSourceRecord) => {
    handleAlert(
      `Are you sure?`,
      `Delete this record for <br> ${record.email}`,
      "question",
      "Confirm",
      async () => {
        const request = await AppDataSourceService.deleteDataSourceRecords({
          appDataSourceId: dataSourceId || "",
          appDataSourceRecordIds: [record.appDataSourceRecordId],
        });
        if ("data" in request) {
          getDataSourceRecord({
            appDataSourceId: dataSourceId,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedRecords([]);
          setSelectAllChecked(false);
        }
      }
    );
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

  const skipDataSourceRecord = async (record: DataSourceRecord) => {
    const payload: SkipDataSourcePayload = {
      appDataSourceId: dataSourceId || "",
      appDataSourceRecordIds: [record.appDataSourceRecordId],
      isSkipped: !record.isSkipped,
    };
    const request = await AppDataSourceService.skipDatasource(payload);
    if ("data" in request && "message" in request.data) {
      const records = state.DataSourceRecord;
      const index = records?.findIndex(
        (r) => r.appDataSourceRecordId === record.appDataSourceRecordId
      );
      records[index].isSkipped = !records[index].isSkipped;
      setState((prevState) => {
        return { ...prevState, DataSourceRecord: records };
      });
      showToast(request.data.message, "success");
      setSelectAllChecked(false);
      setCheckedRecords([]);
    }
  };

  useEffect(() => {
    if (dataSourceId) {
      getDataSourceRecord({
        appDataSourceId: dataSourceId,
        metaData: {
          limit: paginationState.itemsPerPage,
          offset: (paginationState.page - 1) * paginationState.itemsPerPage,
          sortBy: sortState.sortBy,
          sortOn: sortState.sortOn,
        },
      });
      MenuComponent.reinitialization();
    }
  }, [
    paginationState.page,
    paginationState.itemsPerPage,
    sortState.sortOn,
    sortState.sortBy,
    dataSourceId,
  ]);

  return (
    <>
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Data Source Records"}
        id="addJob"
        modalSize="modal-xl"
      >
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
                  getDataSourceRecord({ metaData: { limit: e.target.value } });
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
                {checkedRecords?.length > 0 ? (
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
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="card-body pt-0">
            <table
              className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
              id="kt_service_record_table"
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
                    id="ngUserId"
                    onClick={onClickTableHeader}
                    className={clsx(
                      "min-w-125px table-sort cursor-pointer text-center",
                      {
                        "table-sort-asc":
                          sortState.sortOn === "ngUserId" &&
                          sortState.sortBy === "asc",
                      },
                      {
                        "table-sort-desc":
                          sortState.sortOn === "ngUserId" &&
                          sortState.sortBy === "desc",
                      }
                    )}
                  >
                    NG User ID
                  </th>
                  <th
                    id="firstName"
                    onClick={onClickTableHeader}
                    className={clsx(
                      "min-w-250px table-sort cursor-pointer text-center",
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
                    {" "}
                    Name
                  </th>
                  <th className="text-center min-w-100px">Is Skipped</th>
                  <th className="text-center min-w-50px">Actions</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {state.DataSourceRecord?.map((record) => {
                  return (
                    <tr key={record.appDataSourceRecordId}>
                      <td>
                        <div className="form-check form-check-sm form-check-custom form-check-solid">
                          <input
                            id={record.appDataSourceRecordId}
                            className="form-check-input selectBox"
                            type="checkbox"
                            checked={checkedRecords.includes(
                              record.appDataSourceRecordId || ""
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
                          text={record.appDataSourceRecordId || ""}
                        >
                          <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                            {`${record.appDataSourceRecordId?.substring(
                              0,
                              10
                            )}...`}
                          </span>
                        </CopyToClipboard>
                      </td>
                      <td className="mw-125px text-truncate text-center">
                        <span className="text-gray-800 mb-1">
                          {record.ngUserId}
                        </span>
                      </td>
                      <td className="mw-250px text-truncate">
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                            <a href="#">
                              <div className="symbol-label">
                                <Avatar
                                  name={`${record.firstName} ${record.lastName}`}
                                  alt={`${record.firstName} ${record.lastName}`}
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
                              {`${record.firstName} ${record.lastName}`}
                            </a>
                            <span>{record.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="mw-75px text-center">
                        <span
                          className={clsx("badge badge-sm badge-square px-2", {
                            "badge-light-success": record.isSkipped,
                            "badge-light-danger": !record.isSkipped,
                          })}
                        >
                          {`${record.isSkipped ? "Yes" : "No"}`}
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
                              onClick={() => openrecordsModal(record)}
                            >
                              View
                            </a>
                          </div>
                          <div className="menu-item px-3">
                            <a
                              className="menu-link px-3"
                              onClick={() => {
                                skipDataSourceRecord(record);
                              }}
                            >
                              {record.isSkipped ? "UnSkip" : "Skip"}
                            </a>
                          </div>
                          <div className="menu-item px-3">
                            <a
                              className="menu-link px-3 text-danger"
                              onClick={() => {
                                deleteDataSourceRecord(record);
                              }}
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
                  state.recordCounts / paginationState.itemsPerPage
                )}
                showingFrom={paginationState.showingFrom}
                showingTill={paginationState.showingTill}
                totalRecords={state.recordCounts}
              />
            </div>
          </div>
        </div>
        <DataSourceRecordModal
          record={recordsModalState.record}
          closeModal={closerecordsModal}
          showModal={recordsModalState.showModal}
        />
      </ModalComponent>
    </>
  );
};
