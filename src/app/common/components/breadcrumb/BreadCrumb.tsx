import React, { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  values: { link: string | null; title: string }[];
};

const BreadCrumb: FC<Props> = ({ values }) => {
  const title = values[values?.length - 1]?.title;
  return (
    <div
      id="kt_app_toolbar"
      className="app-toolbar border-gray-400 py-3 py-lg-6 rounded-4"
    >
      <div
        id="kt_app_toolbar_container"
        className="app-container container-fluid d-flex flex-stack"
      >
        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
          <h1 className="page-heading d-flex text-dark fw-bold fs-2 flex-column justify-content-center my-0">
            {title}
          </h1>
          <ul className="breadcrumb breadcrumb-separatorless fw-semibold">
            {values?.map((value, index) => {
              return (
                <React.Fragment key={index}>
                  <li className="breadcrumb-item text-muted">
                    <Link
                      to={value.link || ""}
                      className="text-muted text-hover-primary"
                    >
                      {value.title}
                    </Link>
                  </li>
                  {index === values.length - 1 ? null : (
                    <li className="breadcrumb-item">
                      <i className="fa-solid fa-angles-right"></i>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export { BreadCrumb };
