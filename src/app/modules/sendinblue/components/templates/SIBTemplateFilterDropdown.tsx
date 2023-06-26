import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";
import { Option } from "../../../../common/globals/common.model";
import { SendInBlueSenderService } from "../../services/sendinblue_sender.service";
import { GetTemplateOptions } from "../../models/sendinblue_template.model";

const initialValues: GetTemplateOptions = {
  appSendInBlueSenderId: null,
  search: null,
  isTestSent: null,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const SIBTemplateFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [appSenderOptions, setAppSenderOptions] = useState<any>([]);
  const [selectState, setSelectState] = useState<{
    appSendInBlueSenderId: Option;
  }>({
    appSendInBlueSenderId: { label: "Choose One", value: null },
  });

  const getSenderIds = async () => {
    const request = await SendInBlueSenderService.getSenders({
      metaData: { fields: ["appSendInBlueSenderId", "name"], limit: -1 },
    });
    if ("data" in request) {
      const sibSenders = request.data.sendInBlueSenders;
      setAppSenderOptions(
        sibSenders?.map((sender) => {
          return { value: sender.appSendInBlueSenderId, label: sender.name };
        })
      );
    }
  };

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
      isTestSent: null,
      page: formik.values.page,
    });
    formik.setFieldValue("appSendInBlueSenderId", null);
    setSelectState({
      appSendInBlueSenderId: {
        label: "Choose One",
        value: null,
      },
    });
    formik.resetForm();
  };

  const clearTestSent = () => formik.setFieldValue("isTestSent", null);

  useEffect(() => {
    getSenderIds();
  }, []);

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
            <label className="form-label fw-bold">SendInBlue Sender</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue(
                  "appSendInBlueSenderId",
                  option?.value || ""
                );
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    appSendInBlueSenderId: {
                      label: option?.label || "",
                      value: option?.value || "",
                    },
                  };
                });
              }}
              value={selectState.appSendInBlueSenderId}
              options={appSenderOptions}
            />
          </div>
          <div className="fv-row mb-5">
            <div className="fv-row row mb-5">
              <label className="form-label fw-bold">Tested</label>
              <div className="col-5">
                <div data-kt-buttons="true">
                  <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success w-100">
                    <div className="d-flex align-items-center justify-content-evenly">
                      <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                        <input
                          className="form-check-input w-15px h-15px"
                          type="radio"
                          {...formik.getFieldProps("isTestSent")}
                          value={true.toString()}
                          checked={formik.values.isTestSent === "true"}
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
                          {...formik.getFieldProps("isTestSent")}
                          checked={formik.values.isTestSent === "false"}
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
                  onClick={clearTestSent}
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
