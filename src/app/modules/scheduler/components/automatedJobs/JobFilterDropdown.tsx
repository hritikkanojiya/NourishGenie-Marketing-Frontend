import { FC, useEffect, useState } from "react";
import { Option } from "../../../../common/globals/common.model";
import { useFormik } from "formik";
import { GetJobsOptions } from "../../models/automated_jobs.model";
import { SmartFunctionService } from "../../services/smart_functions.service";
import { CronExpressionService } from "../../services/cron_expression.service";
import Select from "react-select";

const initialValues: GetJobsOptions = {
  appAutomatedJobId: null,
  appCronExpressionId: null,
  appSmartFunctionId: null,
  isActive: null,
  search: null,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const JobFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [expressionIdOptions, setExpressionIdOptions] = useState<any>([]);
  const [smartFuncIdOptions, setSmartFuncIdOptions] = useState<any>([]);
  const [selectState, setSelectState] = useState<{
    automatedJobId: Option;
    cronExpressionId: Option;
    smartFunctionId: Option;
  }>({
    automatedJobId: { label: "Choose One", value: null },
    cronExpressionId: { label: "Choose One", value: null },
    smartFunctionId: { label: "Choose One", value: null },
  });

  const getSmartFunctionIds = async () => {
    const request = await SmartFunctionService.getSmartFunctions({
      metaData: { fields: ["appSmartFunctionId", "name"], limit: -1 },
    });
    if ("data" in request) {
      const smartFunction = request.data.appSmartFunctions;
      setSmartFuncIdOptions(
        smartFunction?.map((smartFunc) => {
          return { value: smartFunc.appSmartFunctionId, label: smartFunc.name };
        })
      );
    }
  };

  const getCronExpressionIds = async () => {
    const request = await CronExpressionService.getCronExpressions({
      metaData: { fields: ["appCronExpressions", "name"], limit: -1 },
    });
    if ("data" in request) {
      const cronExpression = request.data.appCronExpressions;
      setExpressionIdOptions(
        cronExpression?.map((cronExpression) => {
          return {
            value: cronExpression.appCronExpressionId,
            label: cronExpression.name,
          };
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
      appAutomatedJobId: null,
      appCronExpressionId: null,
      appSmartFunctionId: null,
      isActive: null,
      search: null,
    });
    formik.setFieldValue("appAutomatedJobId", null);
    formik.setFieldValue("appCronExpressionId", null);
    formik.setFieldValue("appSmartFunctionId", null);
    formik.setFieldValue("isActive", null);
    setSelectState({
      automatedJobId: {
        label: "Choose One",
        value: null,
      },
      cronExpressionId: {
        label: "Choose One",
        value: null,
      },
      smartFunctionId: {
        label: "Choose One",
        value: null,
      },
    });
    formik.resetForm();
  };

  const clearState = () => formik.setFieldValue("isActive", null);

  useEffect(() => {
    getSmartFunctionIds();
    getCronExpressionIds();
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
                type="text"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Page"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.page || ""}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Cron Expression</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("appCronExpressionId", option?.value);
                setSelectState((previousState) => {
                  return {
                    ...previousState,
                    cronExpressionId: {
                      label: option?.label || "",
                      value: option?.value,
                    },
                  };
                });
              }}
              value={selectState.cronExpressionId}
              options={expressionIdOptions}
            />
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Smart Function</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("appSmartFunctionId", option?.value);
                setSelectState((previousState) => {
                  return {
                    ...previousState,
                    smartFunctionId: {
                      label: option?.label || "",
                      value: option?.value,
                    },
                  };
                });
              }}
              value={selectState.smartFunctionId}
              options={smartFuncIdOptions}
            />
          </div>
          <div className="fv-row mb-5">
            <div className="fv-row row mb-5">
              <label className="form-label fw-bold">State</label>
              <div className="col-5">
                <div data-kt-buttons="true">
                  <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success w-100">
                    <div className="d-flex align-items-center justify-content-evenly">
                      <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                        <input
                          className="form-check-input w-15px h-15px"
                          type="radio"
                          {...formik.getFieldProps("isActive")}
                          value={true.toString()}
                          checked={formik.values.isActive === "true"}
                        />
                      </div>
                      <div className="fw-bold">Active</div>
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
                          {...formik.getFieldProps("isActive")}
                          checked={formik.values.isActive === "false"}
                          value={false.toString()}
                        />
                      </div>
                      <div className="fw-bold">InActive</div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-2 m-auto">
                <label
                  onClick={clearState}
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
