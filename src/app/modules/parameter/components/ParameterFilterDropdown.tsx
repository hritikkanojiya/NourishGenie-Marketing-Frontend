import { FC, useState } from "react";
import { useFormik } from "formik";
import { Option } from "../../../common/globals/common.model";
import Select from "react-select";
import { GetAppParameterOptions } from "../models/app_parameter.model";

const initialValues: GetAppParameterOptions = {
  appParameterId: null,
  category: null,
  search: null,
  type: null,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const ParameterFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [selectState, setSelectState] = useState<{
    appParameterId: Option;
    category: Option;
    type: Option;
  }>({
    appParameterId: { label: "Choose One", value: null },
    category: { label: "Choose One", value: null },
    type: { label: "Choose One", value: null },
  });

  const categoryOptions = [
    { label: "MARKETING", value: "MARKETING" },
    { label: "CONTACT", value: "CONTACT" },
  ];

  const typeOptions = [
    { label: "STATIC", value: "STATIC" },
    { label: "DYNAMIC", value: "DYNAMIC" },
  ];

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setFilterOptions(values);
    },
  });

  const resetForm = () => {
    setFilterOptions({
      appParameterId: null,
      type: null,
      search: null,
      category: null,
    });
    formik.setFieldValue("appParameterId", null);
    formik.setFieldValue("category", null);
    formik.setFieldValue("type", null);
    setSelectState({
      appParameterId: {
        label: "Choose One",
        value: null,
      },
      category: {
        label: "Choose One",
        value: null,
      },
      type: {
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
              <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
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
            <small className="form-text text-muted">
              <b>Search</b> in name, description
            </small>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Category</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("category", option?.value || "");
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    category: {
                      label: option?.label || "",
                      value: option?.value || "",
                    },
                  };
                });
              }}
              value={selectState.category}
              options={categoryOptions}
            />
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Type</label>
            <Select
              isClearable={true}
              isMulti={false}
              isDisabled={formik.values.category === "CONTACT"}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("type", option?.value || "");
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    type: {
                      label: option?.label || "",
                      value: option?.value || "",
                    },
                  };
                });
              }}
              value={selectState.type}
              options={typeOptions}
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
