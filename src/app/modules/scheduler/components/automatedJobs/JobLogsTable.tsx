/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */

import clsx from "clsx";
import { FC, ReactNode, useEffect, useState } from "react";
import { showToast } from "../../../../common/toastify/toastify.config";
import { PaginationComponent } from "../../../../common/components/pagination/PaginationComponent";
import {
  CURRENT_PAGE,
  IST_DATE_FORMAT,
  onChangeSortObj,
  sortObj,
} from "../../../../common/globals/common.constants";
import CopyToClipboard from "react-copy-to-clipboard";
import { format } from "date-fns";
import { AutomatedJobsService } from "../../services/automated_jobs.service";
import {
  AutomatedJobLogs,
  ReadJobLogsOptions,
} from "../../models/automated_jobs.model";
import { AutomatedJobLogsModal } from "./LogsModal";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { useSearchParams } from "react-router-dom";

type Props = {
  closeModal: () => void;
  showModal: boolean;
  jobId: string | null;
};

export const AutomatedJobLogsTable: FC<Props> = ({
  closeModal,
  showModal,
  jobId,
}) => {
  const [logsModalState, setLogsModalState] = useState<{
    showModal: boolean;
    log: AutomatedJobLogs | {};
  }>({ log: {}, showModal: false });
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const openLogsModal = (log: AutomatedJobLogs) =>
    setLogsModalState((prevState) => {
      return { ...prevState, showModal: true, log: log };
    });
  const closeLogsModal = () =>
    setLogsModalState((prevState) => {
      return { ...prevState, showModal: false };
    });

  const [state, setState] = useState<{
    automatedJobLogs: AutomatedJobLogs[];
    logCounts: number;
  }>({
    automatedJobLogs: [],
    logCounts: 0,
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

  const getAutomatedJobLogs = async (options?: ReadJobLogsOptions) => {
    const request = await AutomatedJobsService.readAutomatedJobLogs(options);
    const response = request;
    if ("data" in response && "message" in response.data) {
      const totalRecords = response.data.metaData.total_records || 0;
      setState((previousState) => {
        return {
          ...previousState,
          automatedJobLogs: response.data.automatedJobLogs,
          logCounts: totalRecords,
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
    if (jobId) {
      let offset = (paginationState.page - 1) * paginationState.itemsPerPage;
      if (state.logCounts > 0 && offset > state.logCounts) {
        offset = 0;
        const page = { selected: 0 };
        onPageChange(page);
      }
      getAutomatedJobLogs({
        appAutomatedJobId: jobId,
        metaData: {
          limit: paginationState.itemsPerPage,
          offset: offset,
          sortBy: sortState.sortBy,
          sortOn: sortState.sortOn,
        },
      });
    }
  }, [
    paginationState.page,
    paginationState.itemsPerPage,
    sortState.sortOn,
    sortState.sortBy,
    jobId,
  ]);

  return (
    <>
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Create Automated Job Log"}
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
                  getAutomatedJobLogs({ metaData: { limit: e.target.value } });
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
              ></div>
            </div>
          </div>
          <div className="card-body pt-0">
            <table
              className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
              id="kt_service_log_table"
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
                    id="type"
                    onClick={onClickTableHeader}
                    className={clsx(
                      "min-w-125px table-sort cursor-pointer text-center",
                      {
                        "table-sort-asc":
                          sortState.sortOn === "type" &&
                          sortState.sortBy === "asc",
                      },
                      {
                        "table-sort-desc":
                          sortState.sortOn === "type" &&
                          sortState.sortBy === "desc",
                      }
                    )}
                  >
                    Type
                  </th>
                  <th
                    id="description"
                    onClick={onClickTableHeader}
                    className={clsx(
                      "min-w-250px table-sort cursor-pointer text-center",
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
                    id="scriptPath"
                    onClick={onClickTableHeader}
                    className={clsx(
                      "min-w-75px text-center table-sort cursor-pointer",
                      {
                        "table-sort-asc":
                          sortState.sortOn === "scriptPath" &&
                          sortState.sortBy === "asc",
                      },
                      {
                        "table-sort-desc":
                          sortState.sortOn === "scriptPath" &&
                          sortState.sortBy === "desc",
                      }
                    )}
                  >
                    Script Path
                  </th>
                  <th className="text-center min-w-100px">Created Date</th>
                  <th className="text-center min-w-50px">Actions</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {state.automatedJobLogs?.map((log) => {
                  return (
                    <tr key={log.automatedJobLogId}>
                      <td className="cursor-pointer">
                        <CopyToClipboard
                          onCopy={(text, result) => {
                            result &&
                              showToast("ID copied to clipboard", "success");
                          }}
                          text={log.automatedJobLogId || ""}
                        >
                          <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                            {`${log.automatedJobLogId?.substring(0, 10)}...`}
                          </span>
                        </CopyToClipboard>
                      </td>
                      <td className="mw-125px text-truncate text-center">
                        <span className="text-gray-800 mb-1">{log.type}</span>
                      </td>
                      <td className="mw-250px text-truncate text-center">
                        <span className="text-gray-800 mb-1">
                          {`${log.description?.substring(0, 10)}...`}
                        </span>
                      </td>
                      <td className="mw-75px text-center">
                        <span
                          className={clsx(
                            "badge badge-sm badge-square px-2 badge-light-success"
                          )}
                        >
                          {`${log.scriptPath?.substring(0, 10)}...`}
                        </span>
                      </td>
                      <td className="mw-150px fw-bold text-center">
                        <span>
                          {log?.createdAt
                            ? format(new Date(log?.createdAt), IST_DATE_FORMAT)
                            : ("" as ReactNode)}
                        </span>
                      </td>
                      <td className="mw-150px fw-bold text-center">
                        <button
                          onClick={() => openLogsModal(log)}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </button>
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
                  state.logCounts / paginationState.itemsPerPage
                )}
                showingFrom={paginationState.showingFrom}
                showingTill={paginationState.showingTill}
                totalRecords={state.logCounts}
              />
            </div>
          </div>
        </div>
      </ModalComponent>
      <AutomatedJobLogsModal
        closeModal={closeLogsModal}
        log={logsModalState.log}
        showModal={logsModalState.showModal}
      />
    </>
  );
};
