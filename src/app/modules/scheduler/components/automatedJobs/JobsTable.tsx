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
import CopyToClipboard from "react-copy-to-clipboard";
import { format } from "date-fns";
import {
  AutomatedJob,
  GetJobsOptions,
} from "../../models/automated_jobs.model";
import { AutomatedJobsService } from "../../services/automated_jobs.service";
import { MenuComponent } from "../../../../../_metronic/assets/ts/components/MenuComponent";
import { JobFilterDropdown } from "./JobFilterDropdown";
import { AutomatedJobLogsTable } from "./JobLogsTable";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { MetaData } from "../../../../common/globals/common.model";

type Props = {
  openModal: (
    mode: "create" | "edit" | "view",
    jobDetails: AutomatedJob | {}
  ) => any;
  reRenderComponent: boolean;
};

export const AutomatedJobsTable: FC<Props> = ({
  openModal,
  reRenderComponent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [checkedJobs, setCheckedJobs] = useState<string[]>([]);
  const [modalState, setModalState] = useState<{
    showModal: boolean;
    jobId: string | null;
  }>({ showModal: false, jobId: null });

  const openLogsModal = (jobId: string) =>
    setModalState({ jobId: jobId, showModal: true });
  const closeLogsModal = () => setModalState({ jobId: "", showModal: false });
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [state, setState] = useState<{
    automatedJobs: AutomatedJob[];
    jobCounts: number;
  }>({
    automatedJobs: [],
    jobCounts: 0,
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

  const [filterOptions, setFilterOptions] = useState<GetJobsOptions>({
    appAutomatedJobId: null,
    appCronExpressionId: null,
    appSmartFunctionId: null,
    isActive: null,
    page: 1,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "selectAll") {
      const { checked } = e.target;
      setCheckedJobs(
        checked
          ? state.automatedJobs?.map((job) => job.appAutomatedJobId || "")
          : []
      );
      setSelectAllChecked(checked);
    } else {
      const { checked, id } = e.target;
      setCheckedJobs((prevcheckedJobs) =>
        checked
          ? [...prevcheckedJobs, id]
          : prevcheckedJobs.filter((jobId) => jobId !== id)
      );
      setSelectAllChecked(false);
    }
  };

  const onClickDelete = () => {
    handleAlert(
      `Are you sure?`,
      `You won't be able to revert this! </br> Total ${
        checkedJobs.length
      } record${checkedJobs.length > 1 ? "s" : ""} will be deleted.`,
      "question",
      "Confirm",
      async () => {
        const request = await AutomatedJobsService.deleteAutomatedJobs(
          checkedJobs
        );
        if ("data" in request) {
          getAutomatedJobs({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedJobs([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const deleteJob = (job: AutomatedJob) => {
    handleAlert(
      `Are you sure?`,
      `Delete this job <br> ${job.name}`,
      "question",
      "Confirm",
      async () => {
        const request = await AutomatedJobsService.deleteAutomatedJobs([
          job.appAutomatedJobId || "",
        ]);
        if ("data" in request) {
          getAutomatedJobs({
            ...filterOptions,
            metaData: {
              limit: paginationState.itemsPerPage,
              offset: (paginationState.page - 1) * paginationState.itemsPerPage,
              sortBy: sortState.sortBy,
              sortOn: sortState.sortOn,
            },
          });
          showToast(request.data.message, "success");
          setCheckedJobs([]);
          setSelectAllChecked(false);
        }
      }
    );
  };

  const getAutomatedJobs = async (options?: GetJobsOptions) => {
    setLoading(true);
    const request = await AutomatedJobsService.getAutomatedJobs(options);
    const response = request;
    if ("data" in response && "message" in response.data) {
      const totalRecords = response.data.metaData.total_records || 0;
      setState((previousState) => {
        return {
          ...previousState,
          automatedJobs: response.data.appAutomatedJobs,
          jobCounts: totalRecords,
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

  const toggleJob = async (jobId: string, isActive: boolean | string) => {
    const request = await AutomatedJobsService.toggleAutomatedJob({
      appAutomatedJobIds: [jobId],
      isActive: !isActive,
    });
    if ("data" in request) {
      showToast(request.data.message, "success");
      const automatedJobs = state.automatedJobs;
      const index = state.automatedJobs.findIndex(
        (job) => job.appAutomatedJobId === jobId
      );
      automatedJobs[index].isActive = !automatedJobs[index].isActive;
      setState({ ...state, automatedJobs: automatedJobs });
    }
  };

  const forceExecuteJob = async (jobId: string) => {
    const request = await AutomatedJobsService.forceExecuteAutomatedJob([
      jobId,
    ]);
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
    const filter: GetJobsOptions = {
      appCronExpressionId: params.get("appCronExpressionId") || null,
      appSmartFunctionId: params.get("appSmartFunctionId") || null,
      isActive: Boolean(params.get("isActive")) || null,
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
    MenuComponent.reinitialization();
    if (reRenderComponent) {
      let page = paginationState.page;
      if (filterOptions.page && filterOptions.page > 1) {
        page = filterOptions.page;
      }
      let offset = (page - 1) * paginationState.itemsPerPage;
      if (state.jobCounts > 0 && offset > state.jobCounts) {
        const lastPage = Math.ceil(
          state.jobCounts / paginationState.itemsPerPage
        );
        offset = (lastPage - 1) * paginationState.itemsPerPage;
        setCurrentPage(lastPage);
      } else {
        setCurrentPage(page);
      }
      let filter: GetJobsOptions = {
        appCronExpressionId: filterOptions.appCronExpressionId,
        search: filterOptions.search,
        appSmartFunctionId: filterOptions.appSmartFunctionId,
        appAutomatedJobId: filterOptions.appAutomatedJobId,
        isActive: filterOptions.isActive,
      };
      const initialmetaData: MetaData = {
        limit: paginationState.itemsPerPage,
        offset: offset,
        sortBy: sortState.sortBy,
        sortOn: sortState.sortOn,
      };
      const metaData = getMetaDataValues(location, initialmetaData);
      getAutomatedJobs({
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
    filterOptions.appAutomatedJobId,
    filterOptions.appCronExpressionId,
    filterOptions.appSmartFunctionId,
    filterOptions.search,
    filterOptions.isActive,
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
                getAutomatedJobs({ metaData: { limit: e.target.value } });
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
              {checkedJobs?.length > 0 ? (
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
                  <JobFilterDropdown setFilterOptions={setFilterOptions} />
                </>
              )}

              <button
                onClick={() => openModal("create", {})}
                type="button"
                className="btn btn-primary"
              >
                Create Automated Job
              </button>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <table
            className="table align-middle table-row-dashed table-responsive fs-6 gy-5"
            id="kt_service_job_table"
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
                    "min-w-250px table-sort cursor-pointer",
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
                  id="isActive"
                  onClick={onClickTableHeader}
                  className={clsx(
                    "min-w-75px text-center table-sort cursor-pointer",
                    {
                      "table-sort-asc":
                        sortState.sortOn === "isActive" &&
                        sortState.sortBy === "asc",
                    },
                    {
                      "table-sort-desc":
                        sortState.sortOn === "isActive" &&
                        sortState.sortBy === "desc",
                    }
                  )}
                >
                  State
                </th>
                <th className="text-center min-w-100px">Created Date</th>
                <th className="text-center min-w-50px">Actions</th>
              </tr>
            </thead>
            <tbody className="fw-semibold text-gray-600">
              {state.automatedJobs?.map((job) => {
                return (
                  <tr key={job.appAutomatedJobId}>
                    <td>
                      <div className="form-check form-check-sm form-check-custom form-check-solid">
                        <input
                          id={job.appAutomatedJobId}
                          className="form-check-input selectBox"
                          type="checkbox"
                          checked={checkedJobs.includes(
                            job.appAutomatedJobId || ""
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
                        text={job.appAutomatedJobId || ""}
                      >
                        <span className="badge badge-light-dark text-hover-primary text-gray-700 mb-1">
                          {`${job.appAutomatedJobId?.substring(0, 10)}...`}
                        </span>
                      </CopyToClipboard>
                    </td>
                    <td className="mw-125px text-truncate">
                      <span className="text-gray-800 mb-1">{job.name}</span>
                    </td>
                    <td className="mw-250px text-truncate">
                      <span className="text-gray-800 mb-1">
                        {job.description}
                      </span>
                    </td>
                    <td className="mw-75px text-center">
                      <span
                        className={clsx("badge badge-sm badge-square px-2", {
                          "badge-light-success": job.isActive,
                          "badge-light-danger": !job.isActive,
                        })}
                      >
                        {job.isActive ? "Active" : "InActive"}
                      </span>
                    </td>
                    <td className="mw-150px fw-bold text-center">
                      <span>
                        {job?.createdAt
                          ? format(new Date(job?.createdAt), IST_DATE_FORMAT)
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
                            onClick={() => openModal("view", job)}
                          >
                            View
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() => openModal("edit", job)}
                          >
                            Edit
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              openLogsModal(job.appAutomatedJobId || "")
                            }
                          >
                            Logs
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              forceExecuteJob(job.appAutomatedJobId || "")
                            }
                          >
                            Force Execute
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3"
                            onClick={() =>
                              toggleJob(
                                job.appAutomatedJobId || "",
                                job.isActive
                              )
                            }
                          >
                            Toggle Job
                          </a>
                        </div>
                        <div className="menu-item px-3">
                          <a
                            className="menu-link px-3 text-danger"
                            onClick={() => deleteJob(job)}
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
                state.jobCounts / paginationState.itemsPerPage
              )}
              showingFrom={paginationState.showingFrom}
              showingTill={paginationState.showingTill}
              totalRecords={state.jobCounts}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
      <AutomatedJobLogsTable
        closeModal={closeLogsModal}
        jobId={modalState.jobId}
        showModal={modalState.showModal}
      />
    </BlockUI>
  );
};
