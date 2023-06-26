import { FC } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { SUPPORT_EMAIL } from "../../../common/globals/common.constants";

const Error404: FC = () => {
  return (
    <>
      <Helmet>
        <title>Error 404 | Page not found</title>
      </Helmet>
      {/* begin::Title */}
      <h1 className="fw-bolder fs-2x text-gray-900 mb-4">
        Whoops! Page not found...!
      </h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className="fw-semibold fs-5 text-gray-500 mb-7">
        Sorry, it appears the page you were looking for doesn't exist anymore or
        might have been moved. If the problem persists, please contact our
        support at
        <a href={`mailto:${SUPPORT_EMAIL}`} className="fw-bold px-1">
          {SUPPORT_EMAIL}
        </a>
      </div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className="mb-3">
        <img
          src={toAbsoluteUrl("/media/errors/404-error.jpg")}
          className="mw-100 mh-300px theme-light-show"
          alt=""
        />
        <img
          src={toAbsoluteUrl("/media/errors/404-error.jpg")}
          className="mw-100 mh-300px theme-dark-show"
          alt=""
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Link */}
      <div className="mb-0">
        <Link to="/dashboard" className="btn btn-sm btn-primary mt-5">
          Return Home
        </Link>
      </div>
      {/* end::Link */}
    </>
  );
};

export { Error404 };
