/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import Avatar from "react-avatar";
import { AuthTokenService } from "../../../../app/modules/auth/services/authToken.service";

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const logUserOut = async () => {
    await logout();
    navigate("/agent/auth/login");
  };

  const toMyAccount = () => {
    const agentId =
      AuthTokenService.getAgentDetailsFromLocalStorage()?.appAgentId;
    if (agentId) {
      navigate(`/agent/account/${agentId}/overview`);
    }
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-300px mt-lg-5"
      data-kt-menu="true"
    >
      <div className="menu-item px-3 p-0">
        <div className="menu-content d-flex align-items-center px-3 py-0">
          <div className="symbol symbol-50px me-5">
            <Avatar
              name={currentUser?.username}
              alt={currentUser?.username}
              size={"40px"}
              round={true}
              color={"orange"}
            />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bold text-gray-700 d-flex align-items-center fs-4">
              {currentUser?.username}
            </div>
            <a href="#" className="fw-bold text-muted fs-7 mb-1">
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5 py-0">
        {/* to={`/agent/account/${currentUser?.appAgentId}/overview`} */}
        <div className="menu-link px-5 btn" onClick={toMyAccount}>
          <i className="fa-solid fa-user text-muted me-2"></i>
          My Account
        </div>
      </div>

      {/* <div className="separator my-2"></div> */}

      <div className="menu-item px-5 py-0">
        <a onClick={logUserOut} className="menu-link px-5 btn text-danger">
          <i className="fa-solid fa-right-from-bracket text-danger me-2"></i>
          Sign Out
        </a>

        {/* <a href="#" class="btn btn-icon-muted btn-text-muted">
          <span class="svg-icon svg-icon-1">
            <svg>...</svg>
          </span>
          Muted
        </a> */}
      </div>
    </div>
  );
};

export { HeaderUserMenu };
