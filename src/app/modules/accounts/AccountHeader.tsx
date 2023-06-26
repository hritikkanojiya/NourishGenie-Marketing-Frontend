/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useAuth } from "../auth";

const AccountHeader: React.FC = () => {
  const location = useLocation();
  const { agent } = useAuth();
  return (
    <div className="card mb-5 mb-xl-10">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap">
          <div className="me-7 mb-4">
            <div className="symbol symbol-50px symbol-lg-80px symbol-fixed position-relative">
              <img
                src={toAbsoluteUrl("/media/logos/nourish_logo_no_bg.png")}
                alt="NourishGenie"
              />
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="window.location"
                    className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1"
                  >
                    {agent?.username}
                  </a>
                  {/* User Active Status via Socket */}
                </div>
                <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                  <a
                    href="window.location"
                    className="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                  >
                    <i className="fa-solid fa-user me-2"></i>
                    {agent?.appAccessGroup?.name}
                  </a>
                  <a
                    href="window.location"
                    className="d-flex align-items-center text-gray-400 text-hover-primary mb-2"
                  >
                    <i className="fa-solid fa-envelope me-2"></i>
                    {agent?.email}
                  </a>
                </div>
              </div>

              <div className="d-flex my-4">{/* Buttons */}</div>
            </div>
          </div>
        </div>
        <div className="d-flex overflow-auto h-55px">
          <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/agent/account/${agent?.appAgentId}/overview` && "active")
                }
                to={`/agent/account/${agent?.appAgentId}/overview`}
              >
                Overview
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/agent/account/${agent?.appAgentId}/activity` && "active")
                }
                to={`/agent/account/${agent?.appAgentId}/activity`}
              >
                Activity
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={
                  `nav-link text-active-primary me-6 ` +
                  (location.pathname ===
                    `/agent/account/${agent?.appAgentId}/logs` && "active")
                }
                to={`/agent/account/${agent?.appAgentId}/logs`}
              >
                Logs
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export { AccountHeader };
