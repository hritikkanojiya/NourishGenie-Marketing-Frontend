import { FC } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";

type Props = {
  errorCode: number;
  errorType: string;
  errorMessage: string;
};

const Error: FC<Props> = ({ errorCode, errorType, errorMessage }) => {
  return (
    <>
      <Helmet>
        <title>
          {`Error ${errorCode ? errorCode : 500} | ${
            errorType ? errorType : `System Error.`
          }`}
        </title>
      </Helmet>
      {/* begin::Title */}
      <h1 className="fw-bolder fs-2x text-gray-900 mb-4">
        {errorType ? errorType : "System Error"}
      </h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className="fw-semibold fs-5 text-gray-500 mb-7">
        {errorMessage
          ? errorMessage
          : "Something went wrong! Please try again later."}
      </div>
      {/* end::Text */}

      {/* begin::Illustration */}
      <div className="mb-11">
        <img
          src={toAbsoluteUrl("/media/errors/common-error.png")}
          className="mw-100 mh-300px theme-light-show"
          alt=""
        />
        <img
          src={toAbsoluteUrl("/media/errors/common-error.png")}
          className="mw-100 mh-300px theme-dark-show"
          alt=""
        />
      </div>
      {/* end::Illustration */}

      {/* begin::Link */}
      <div className="mb-0">
        <Link to="/dashboard" className="btn btn-sm btn-primary mt-10">
          Return Home
        </Link>
      </div>
      {/* end::Link */}
    </>
  );
};

export { Error };
