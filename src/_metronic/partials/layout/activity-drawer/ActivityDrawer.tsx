import React, { FC, useEffect, useState } from "react";
import { KTSVG } from "../../../helpers";
import { Item1 } from "../../content/activity/Item1";
import {
  AppActivity,
  AppEventLog,
} from "../../../../app/modules/agents/models/app_agent.model";
import { AppAgentService } from "../../../../app/modules/agents/services/app_agent.service";
import { SocketService } from "../../../../app/common/services/socket.service";
import { LoadingButton } from "../../../../app/common/components/loadingButton/LoadingButton";
import { showToast } from "../../../../app/common/toastify/toastify.config";

const ActivityDrawer: FC = () => {
  const [activityLogs, setActivityLogs] = useState<AppActivity[]>([]);
  const [eventLogs, setEventLogs] = useState<AppEventLog[]>([]);
  const [loading, setLoading] = useState(false);

  const getActivityLogs = async () => {
    setLoading(true);
    const request = await AppAgentService.getAppActivities();
    if ("data" in request && "appActivities" in request.data) {
      let logs = request.data.appActivities;
      setActivityLogs(logs);
      setLoading(false);
      if (SocketService.socket?.active) {
        SocketService.socket.on("appActivity", (data: AppActivity) => {
          setActivityLogs((activityLogs) => {
            let updatedLogs: AppActivity[];
            if (activityLogs.length > 0) {
              updatedLogs = [...activityLogs];
              if (updatedLogs.length > 50) {
                updatedLogs.pop();
              }
            } else {
              updatedLogs = [...logs];
            }
            updatedLogs.unshift(data);
            return updatedLogs;
          });
        });
      }
    } else {
      setLoading(false);
    }
  };

  const getAppEventLogs = async () => {
    setLoading(true);
    const request = await AppAgentService.getAppEventLogs();
    if ("data" in request && "appEventLogs" in request.data) {
      let logs = request.data.appEventLogs;
      setEventLogs(logs);
      setLoading(false);
      if (SocketService.socket?.active) {
        SocketService.socket.on("appEvent", (data: AppEventLog) => {
          setEventLogs((eventLogs) => {
            let updatedLogs: AppEventLog[];
            if (eventLogs.length > 0) {
              updatedLogs = [...eventLogs];
              if (updatedLogs.length > 50) {
                updatedLogs.pop();
              }
            } else {
              updatedLogs = [...logs];
            }
            updatedLogs.unshift(data);
            return updatedLogs;
          });
        });
      }
    } else {
      setLoading(false);
    }
  };

  const loadMore = async (logType: "activity" | "event") => {
    if (logType === "event") {
      setLoading(true);
      const offset = eventLogs?.length;
      const request = await AppAgentService.getAppEventLogs({
        metaData: { offset: offset },
      });
      if ("data" in request && "appEventLogs" in request.data) {
        const eventLogArr = eventLogs;
        const eventLogDetails = eventLogArr.concat(request.data.appEventLogs);
        showToast(request.data.message, "success");
        setEventLogs(eventLogDetails);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(true);
      const offset = activityLogs?.length;
      const request = await AppAgentService.getAppActivities({
        metaData: { offset: offset },
      });
      if ("data" in request && "appActivities" in request.data) {
        const activityLogArr = activityLogs;
        const activityLogDetails = activityLogArr.concat(
          request.data.appActivities
        );
        showToast(request.data.message, "success");
        setActivityLogs(activityLogDetails);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getActivityLogs();
    getAppEventLogs();
  }, []);

  return (
    <div
      id="kt_activities"
      className="bg-body"
      data-kt-drawer="true"
      data-kt-drawer-name="activities"
      data-kt-drawer-activate="true"
      data-kt-drawer-overlay="true"
      data-kt-drawer-direction="end"
      data-kt-drawer-toggle="#kt_activities_toggle"
      data-kt-drawer-close="#kt_activities_close"
    >
      <div className="card shadow-none rounded-0">
        <div className="card-header card-header-stretch min-h-75px bg-white sticky-top">
          <div className="card-toolbar my-auto w-100">
            <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
              <li className="nav-item">
                <a
                  className="nav-link active fw-bold text-dark"
                  data-bs-toggle="tab"
                  href="#app_events"
                >
                  Events
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link fw-bold text-dark"
                  data-bs-toggle="tab"
                  href="#app_activities"
                >
                  Activities
                </a>
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-sm btn-icon btn-active-light-primary ms-auto"
              id="kt_activities_close"
            >
              <KTSVG
                path="/media/icons/duotune/arrows/arr061.svg"
                className="svg-icon-1"
              />
            </button>
          </div>
        </div>
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="app_events"
            role="tabpanel"
          >
            <div
              className="card-body position-relative"
              id="kt_activities_body"
            >
              <div
                id="kt_activities_scroll"
                className="position-relative scroll-y me-n5 pe-5"
                data-kt-scroll="true"
                data-kt-scroll-wrappers="#kt_activities_body"
                data-kt-scroll-dependencies="#kt_activities_header, #kt_activities_footer"
                data-kt-scroll-offset="5px"
              >
                <div className="timeline pt-2">
                  {eventLogs?.map((event, index) => {
                    return (
                      <Item1 logType="event" logDetails={event} key={index} />
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="card-footer py-5 text-center sticky-bottom bg-white"
              id="kt_activities_footer"
            >
              <LoadingButton
                btnClass="btn btn-outline btn-outline-primary"
                btnText="Load more"
                loading={loading}
                disableBtn={loading}
                clickHandler={() => loadMore("event")}
              />
            </div>
          </div>
          <div className="tab-pane fade" id="app_activities" role="tabpanel">
            <div
              className="card-body position-relative"
              id="kt_activities_body"
            >
              <div
                id="kt_activities_scroll"
                className="position-relative scroll-y me-n5 pe-5"
                data-kt-scroll="true"
                data-kt-scroll-wrappers="#kt_activities_body"
                data-kt-scroll-dependencies="#kt_activities_header, #kt_activities_footer"
                data-kt-scroll-offset="5px"
              >
                <div className="timeline pt-2">
                  {activityLogs?.map((activity, index) => {
                    return (
                      <Item1
                        logType="activity"
                        logDetails={activity}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className="card-footer py-5 text-center sticky-bottom bg-white"
              id="kt_activities_footer"
            >
              <LoadingButton
                btnText="Load more"
                btnClass="btn btn-outline btn-outline-primary"
                loading={loading}
                disableBtn={loading}
                clickHandler={() => loadMore("activity")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ActivityDrawer };
