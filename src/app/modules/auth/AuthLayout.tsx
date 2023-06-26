/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../common/globals/common.constants";

const randomNumber = (): Number => {
  return Math.floor(Math.random() * 4) + 1;
};

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.height = "100%";
    }
    return () => {
      if (root) {
        root.style.height = "auto";
      }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Auth</title>
      </Helmet>
      <div
        className="d-flex flex-column flex-root"
        id="kt_app_root"
        style={{
          backgroundImage: `url(${toAbsoluteUrl(
            `/media/auth/bg/${randomNumber()}.jpg`
          )})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPositionY: "center",
        }}
      >
        <div className="d-flex flex-column flex-column-fluid flex-lg-row">
          <div className="d-flex flex-center w-lg-50 px-10">
            <div className="d-flex flex-center flex-lg-start flex-column">
              <Link to="/" className="mb-7">
                <img
                  alt="Logo"
                  className="theme-light-show mx-auto mw-100 w-250px w-lg-350px mb-10"
                  src={toAbsoluteUrl(`/media/logos/nourish_genie_no_bg.png`)}
                />
              </Link>
            </div>
          </div>

          <div className="d-flex row-cols-1 flex-center row-cols-lg-auto w-lg-50 p-lg-10 mx-10 mx-lg-0">
            <div className="card rounded-3 w-md-550px">
              <div className="card-body d-flex flex-column p-10 p-lg-20 pb-lg-10">
                <div className="d-flex flex-center flex-column-fluid pb-0 pb-lg-10">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { AuthLayout };
