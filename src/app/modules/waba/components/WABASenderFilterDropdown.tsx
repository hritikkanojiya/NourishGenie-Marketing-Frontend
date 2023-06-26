import { FC, useState } from "react";
import { useFormik } from "formik";
import { Option } from "../../../common/globals/common.model";
import Select from "react-select";
import { GetWABASendersOptions } from "../models/waba_sender.model";

const initialValues: GetWABASendersOptions = {
  appWABASenderId: null,
  provider: null,
  search: null,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const SenderFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [selectState, setSelectState] = useState<{ provider: Option }>({
    provider: { label: "Choose One", value: null },
  });

  const providerOptions = [
    { label: "D360", value: "D360" },
    { label: "Value First", value: "ValueFirst" },
  ];

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setFilterOptions(values);
    },
  });

  const resetForm = () => {
    setFilterOptions({
      appWABASenderId: null,
      provider: null,
      search: null,
      page: formik.values.page,
    });
    formik.setFieldValue("appWABASenderId", null);
    formik.setFieldValue("search", null);
    formik.setFieldValue("provider", null);
    setSelectState({
      provider: {
        label: "Choose One",
        value: null,
      },
    });
    formik.resetForm();
  };

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
            <label className="form-label fw-bold">Provider</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("provider", option?.value || "");
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    provider: {
                      label: option?.label || "",
                      value: option?.value || "",
                    },
                  };
                });
              }}
              value={selectState.provider}
              options={providerOptions}
            />
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
