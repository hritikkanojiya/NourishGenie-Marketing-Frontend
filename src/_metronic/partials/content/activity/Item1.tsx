/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, ReactNode, useState } from "react";
import {
  AppActivity,
  AppEventLog,
} from "../../../../app/modules/agents/models/app_agent.model";
import { format } from "date-fns";
import {
  IST_DATE_FORMAT,
  getEventColor,
  getRequestMethodColor,
  getStatusCodeColor,
} from "../../../../app/common/globals/common.constants";
import { AppActivityLogModal } from "../../layout/activity-drawer/ActivityModal";

type Props = {
  logType: "activity" | "event";
  logDetails: AppActivity | AppEventLog;
};

const Item1: FC<Props> = ({ logType, logDetails }) => {
  const [activityModalState, setActivityModalState] = useState({
    showModal: false,
  });

  const closeActivityModal = () => setActivityModalState({ showModal: false });

  const clickHandler = () => {
    if (logType === "activity" || logType === "event") {
      setActivityModalState({ showModal: true });
    }
  };

  return (
    <>
      <div className="timeline-item">
        <div className="timeline-line w-40px"></div>
        <div className="timeline-icon symbol symbol-circle symbol-40px me-4">
          <div className="symbol-label bg-light">
            {logType === "activity" ? (
              <>
                <i className="fa-solid fa-screwdriver-wrench fs-2"></i>
              </>
            ) : (
              <>
                <i className="fa-solid fa-gear fs-2 fa-spin"></i>
              </>
            )}
          </div>
        </div>
        <div className="timeline-content mt-n1 mb-5">
          <div className="overflow-auto">
            <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-5 py-2">
              {logType === "activity" && "appAgentId" in logDetails ? (
                <>
                  <a
                    className="text-gray-800 fw-bold fs-6 min-w-250px mw-250px text-truncate"
                    style={{ fontFamily: "monospace" }}
                  >
                    {logDetails?.activityDetails.request.originalUrl}
                  </a>
                  <div className="d-flex ms-auto">
                    <div className="px-1 text-center">
                      <span
                        className={`badge badge-sm px-2 text-uppercase badge-light-${getRequestMethodColor(
                          logDetails?.activityDetails.request.method
                            ? logDetails?.activityDetails.request.method
                            : ""
                        )} badge-inline`}
                      >
                        {logDetails?.activityDetails.request.method}
                      </span>
                    </div>
                    <div className="px-1 text-center">
                      <span
                        className={`badge badge-sm px-2 text-uppercase badge-light-${getStatusCodeColor(
                          logDetails?.activityDetails.response.statusCode
                            ? logDetails?.activityDetails.response.statusCode
                            : 0
                        )} badge-inline`}
                      >{`${logDetails?.activityDetails.response.statusCode} ${logDetails?.activityDetails.response.statusMessage}`}</span>
                    </div>
                    <div className="px-1 text-center">
                      <span className="badge badge-light-dark text-gray-700">
                        <i className="fa-regular fa-hourglass-half me-2"></i>
                        {logDetails?.activityDetails.processingTime}ms
                      </span>
                    </div>
                    <div className="px-1 min-w-100px text-center">
                      <span className="badge badge-light-dark text-gray-700">
                        <i className="fa-regular fa-clock me-2"></i>
                        {logDetails?.createdAt
                          ? format(
                              new Date(logDetails.createdAt),
                              IST_DATE_FORMAT
                            )
                          : ("" as ReactNode)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <a
                    className="text-gray-800 fw-bold fs-6 min-w-250px text-truncate"
                    style={{ fontFamily: "monospace" }}
                  >
                    {"appEventId" in logDetails && logDetails.name}
                  </a>
                  <div className="d-flex ms-auto">
                    <div className="px-1 text-center">
                      <span
                        className={`badge badge-sm px-2 text-uppercase badge-light-${getEventColor(
                          "appEventId" in logDetails && logDetails.status
                            ? logDetails.status
                            : ""
                        )} badge-inline`}
                      >
                        {"appEventId" in logDetails && logDetails.status}
                      </span>
                    </div>
                    <div className="px-1 min-w-100px text-center">
                      <span className="badge badge-light-dark text-gray-700">
                        <i className="fa-regular fa-clock me-2"></i>
                        {logDetails?.createdAt
                          ? format(
                              new Date(logDetails.createdAt),
                              IST_DATE_FORMAT
                            )
                          : ("" as ReactNode)}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <button
                onClick={clickHandler}
                type="button"
                className="btn btn-sm btn-light ms-2 p-4 py-2"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      {logDetails && (
        <AppActivityLogModal
          logDetails={logDetails}
          closeModal={closeActivityModal}
          showModal={activityModalState.showModal}
        />
      )}
    </>
  );
};

export { Item1 };
