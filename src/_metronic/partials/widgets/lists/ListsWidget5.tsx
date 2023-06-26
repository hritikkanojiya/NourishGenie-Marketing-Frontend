/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ReactNode } from "react";
import { KTIcon } from "../../../helpers";
import { Dropdown1 } from "../../content/dropdown/Dropdown1";
import { AppActivity } from "../../../../app/modules/agents/models/app_agent.model";
import { format } from "date-fns";

type Props = {
  className: string;
  agentActivities: AppActivity[];
};

const ListsWidget5: React.FC<Props> = ({ className, agentActivities }) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className="card-header align-items-center border-0 mt-4">
        <h3 className="card-title align-items-start flex-column">
          <span className="fw-bold mb-2 text-dark">Activities</span>
          {/* <span className='text-muted fw-semibold fs-7'>890,344 Sales</span> */}
        </h3>
        <div className="card-toolbar">
          {/* begin::Menu */}
          <button
            type="button"
            className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <KTIcon iconName="category" className="fs-2" />
          </button>
          <Dropdown1 />
          {/* end::Menu */}
        </div>
      </div>
      <div className="card-body pt-5">
        <div className="timeline-label">
          {agentActivities?.map((activity) => {
            return (
              <div className="timeline-item" key={activity.appActivityId}>
                {/* <div className='timeline-label fw-bold text-gray-800 fs-6'>08:42</div> */}
                <div className="timeline-label fw-bold text-gray-800 fs-6">
                  {format(new Date(activity.createdAt), "HH:mm") as ReactNode}
                </div>
                <div className="timeline-badge">
                  <i className="fa fa-genderless text-warning fs-1"></i>
                </div>
                <div className="fw-mormal timeline-content text-muted ps-3">
                  {`${activity.activityDetails.response.statusCode} ${activity.activityDetails.response.statusMessage}  ${activity.activityDetails.request.originalUrl}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { ListsWidget5 };
