import { FC } from "react";
import { useFormik } from "formik";
import { GetSenderOptions } from "../../models/sendinblue_sender.model";

const initialValues: GetSenderOptions = {
  appSendInBlueSenderId: null,
  search: null,
  isVerified: null,
  sendInBlueSenderId: null,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const SIBSenderFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setFilterOptions(values);
    },
  });

  const resetForm = () => {
    setFilterOptions({
      appSendInBlueSenderId: null,
      search: null,
      isVerified: null,
      sendInBlueSenderId: null,
      page: formik.values.page,
    });
    formik.resetForm();
  };

  const clearVerified = () => formik.setFieldValue("isVerified", null);

  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
      data-kt-menu="true"
    >
      <div className="px-7 py-5">
        <div className="fs-5 text-dark fw-bolder">Filter Options</div>
      </div>
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="separator border-gray-200"></div>
        <div className="px-7 py-5 pb-0">
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bold text-dark">Search</label>
            <div className="position-relative">
              <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
              <input
                {...formik.getFieldProps("search")}
                type="text"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Search"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.search || ""}
              />
            </div>
            <small className="form-text text-muted">
              <b>Search</b> in name, description
            </small>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bold text-dark">Page</label>
            <div className="position-relative">
              <input
                {...formik.getFieldProps("page")}
                type="number"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Page"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.page || ""}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <div className="fv-row row mb-5">
              <label className="form-label fw-bold">Verified</label>
              <div className="col-5">
                <div data-kt-buttons="true">
                  <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success w-100">
                    <div className="d-flex align-items-center justify-content-evenly">
                      <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                        <input
                          className="form-check-input w-15px h-15px"
                          type="radio"
                          {...formik.getFieldProps("isVerified")}
                          value={true.toString()}
                          checked={formik.values.isVerified === "true"}
                        />
                      </div>
                      <div className="fw-bold">Yes</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-5">
                <div data-kt-buttons="true">
                  <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-danger w-100">
                    <div className="d-flex align-items-center justify-content-evenly">
                      <div className="form-check form-check-custom form-check-solid form-check-danger pe-1">
                        <input
                          className="form-check-input w-15px h-15px"
                          type="radio"
                          {...formik.getFieldProps("isVerified")}
                          checked={formik.values.isVerified === "false"}
                          value={false.toString()}
                        />
                      </div>
                      <div className="fw-bold">No</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-2 m-auto">
                <label
                  onClick={clearVerified}
                  className="btn btn-outline btn-outline-dashed btn-outline-dark p-3"
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="separator border-gray-200"></div>
        <div className="py-5 d-flex justify-content-evenly">
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            data-kt-menu-dismiss="true"
          >
            Apply
          </button>
          <button
            type="button"
            className="btn btn-sm btn-light btn-active-light-primary me-2"
            data-kt-menu-dismiss="true"
            onClick={resetForm}
            onReset={formik.handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};