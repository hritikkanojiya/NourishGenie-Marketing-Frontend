import clsx from "clsx";
import Avatar from "react-avatar";
import { useAuth } from "../../../../app/modules/auth";
import { HeaderUserMenu, Search, ThemeModeSwitcher } from "../../../partials";
import { ShortLinkService } from "../../../../app/modules/short_link/services/short_link.service";
import { showToast } from "../../../../app/common/toastify/toastify.config";

const itemClass = "ms-1 ms-lg-3";
const btnClass =
  "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px";
const userAvatarClass = "symbol-35px symbol-md-40px";

const createShortLink = async () => {
  const request = await ShortLinkService.createShortLink(window.location.href);
  if ("data" in request) {
    await navigator.clipboard.writeText(request.data.shortLink);
    showToast("Link copied to clipboard", "success");
  }
};

const Navbar = () => {
  const { currentUser } = useAuth();
  return (
    <div className="app-navbar flex-shrink-0 align-items-center">
      <div
        onClick={createShortLink}
        className={clsx("app-navbar-item d-none d-lg-block", itemClass)}
      >
        <div className={btnClass}>
          <i className="fs-3 fa-solid fa-share-nodes"></i>
        </div>
      </div>

      <div
        className={clsx(
          "app-navbar-item align-items-stretch d-none d-lg-block",
          itemClass
        )}
      >
        <Search />
      </div>

      <div className={clsx("app-navbar-item d-none d-lg-block", itemClass)}>
        <div id="kt_activities_toggle" className={btnClass}>
          <i className="fs-3 fa-solid fa-puzzle-piece"></i>
        </div>
      </div>

      <div className={clsx("app-navbar-item d-none d-lg-block", itemClass)}>
        <ThemeModeSwitcher
          toggleBtnClass={clsx("btn-active-light-primary btn-custom")}
        />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div
          className={clsx("cursor-pointer symbol", userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <Avatar
            className="fw-bold"
            name={currentUser?.username}
            alt={currentUser?.username}
            size={"40px"}
            round={true}
            color={"orange"}
          />
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  );
};

export { Navbar };
