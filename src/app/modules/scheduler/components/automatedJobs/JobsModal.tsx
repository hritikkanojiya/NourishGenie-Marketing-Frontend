/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import Select from "react-select";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { Option } from "../../../../common/globals/common.model";
import { AutomatedJob } from "../../models/automated_jobs.model";
import { CronExpressionService } from "../../services/cron_expression.service";
import { SmartFunctionService } from "../../services/smart_functions.service";
import { AutomatedJobsService } from "../../services/automated_jobs.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

let jobSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  appCronExpressionId: Yup.string()
    .trim()
    .required("Cron Expression is required"),
  appSmartFunctionId: Yup.string()
    .trim()
    .required("Smart function is required"),
  parameters: Yup.mixed(),
  isActive: Yup.boolean().required("Job State is required"),
});

let initialValues: AutomatedJob = {
  appCronExpressionId: "",
  appSmartFunctionId: "",
  name: "",
  description: "",
  parameters: {},
  isActive: false,
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  automatedJob?: AutomatedJob | {};
  closeModal: () => void;
};

export const AutomatedJobModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  automatedJob,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectState, setSelectState] = useState<{
    appCronExpressionId: Option;
    appSmartFunctionId: Option;
    isActive: Option;
  }>({
    appCronExpressionId: { label: "Choose One", value: null },
    appSmartFunctionId: { label: "Choose One", value: null },
    isActive: { label: "", value: false },
  });
  const [optionState, setOptionState] = useState<{
    appCronExpressionId: Option[];
    appSmartFunctionId: Option[];
  }>({ appCronExpressionId: [], appSmartFunctionId: [] });
  const [parameters, setParameters] = useState<
    { name: string; required: boolean }[]
  >([]);

  const getExpressionIds = async () => {
    const request = await CronExpressionService.getCronExpressions({
      metaData: { fields: ["name", "appCronExpressionId"] },
    });
    if ("data" in request) {
      const expressionOptions = request.data.appCronExpressions?.map(
        (expression) => {
          return {
            label: expression.name,
            value: expression.appCronExpressionId,
          };
        }
      );
      setOptionState((prevState) => {
        return { ...prevState, appCronExpressionId: expressionOptions };
      });
    }
  };

  const getFunctionIds = async () => {
    const request = await SmartFunctionService.getSmartFunctions({
      metaData: { fields: ["name", "appSmartFunctionId"] },
    });
    if ("data" in request) {
      const functionOptions = request.data.appSmartFunctions?.map((func) => {
        return { label: func.name, value: func.appSmartFunctionId };
      });
      setOptionState((prevState) => {
        return { ...prevState, appSmartFunctionId: functionOptions };
      });
    }
  };

  const getSmartFunctionParameters = async (functionId: string) => {
    const request = await SmartFunctionService.getSmartFunctions({
      appSmartFunctionId: functionId,
      metaData: { fields: ["parameters"] },
    });
    if ("data" in request) {
      const obj: any = {};
      setParameters([]);
      request.data.appSmartFunctions.forEach((functions) => {
        functions.parameters.forEach((param) => {
          obj[param.parameterName] = "";
          setParameters([
            { name: param.parameterName, required: param.required },
          ]);
        });
      });
      const modifiedParameters = parameters.some((field) => field.required)
        ? Yup.object().shape(
            parameters.reduce((acc, field) => {
              if (field.required) {
                acc[field.name] = Yup.string()
                  .trim()
                  .required(`${field.name} is required`);
              }
              return acc;
            }, {} as { [key: string]: Yup.StringSchema })
          )
        : Yup.mixed();
      jobSchema = Yup.object().shape({
        ...jobSchema.fields,
        parameters: modifiedParameters,
      });
      initialValues = {
        ...formik.values,
        parameters: obj,
        appSmartFunctionId: functionId,
      };
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: jobSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      let data: AutomatedJob = {
        appCronExpressionId: values.appCronExpressionId,
        appSmartFunctionId: values.appSmartFunctionId,
        description: values.description,
        isActive: values.isActive,
        name: values.name,
        parameters: values.parameters,
      };
      if (!editMode) {
        const request = await AutomatedJobsService.createAutomatedJob(data);
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (automatedJob && "appAutomatedJobId" in automatedJob) {
          data = { ...data, appAutomatedJobId: automatedJob.appAutomatedJobId };
          const request = await AutomatedJobsService.updateAutomatedJobs(data);
          if ("data" in request) {
            showToast(request.data.message, "success");
            closeModal();
          }
        }
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    getExpressionIds();
    getFunctionIds();
  }, []);

  useEffect(() => {
    formik.resetForm();
    if ((editMode || readOnlyMode) && automatedJob) {
      if ("appAutomatedJobId" in automatedJob) {
        initialValues = {
          name: automatedJob.name,
          description: automatedJob.description,
          appCronExpressionId: automatedJob.appCronExpressionId,
          appSmartFunctionId: automatedJob.appSmartFunctionId,
          isActive: automatedJob.isActive.toString(),
          parameters: automatedJob.parameters,
        };
        Object.keys(automatedJob.parameters).forEach((param) => {
          setParameters([{ name: param, required: false }]);
        });
        const expressionOption = optionState.appCronExpressionId.find(
          (option) => option.value === automatedJob.appCronExpressionId
        );
        const functionOption = optionState.appSmartFunctionId.find(
          (option) => option.value === automatedJob.appSmartFunctionId
        );
        const isActiveOption: Option = {
          label: automatedJob.isActive ? "Yes" : "No",
          value: automatedJob.isActive,
        };
        setSelectState({
          appCronExpressionId: {
            label: expressionOption?.label || "",
            value: automatedJob.appCronExpressionId,
          },
          appSmartFunctionId: {
            label: functionOption?.label || "",
            value: automatedJob.appSmartFunctionId,
          },
          isActive: isActiveOption,
        });
      }
    } else {
      initialValues = {
        appCronExpressionId: "",
        appSmartFunctionId: "",
        description: "",
        isActive: false,
        name: "",
        parameters: [],
      };
      setSelectState({
        appCronExpressionId: { label: "Choose One", value: null },
        appSmartFunctionId: { label: "Choose One", value: null },
        isActive: { label: "", value: false },
      });
      setParameters([]);
    }
  }, [showModal, editMode, readOnlyMode, automatedJob]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Automated Jobs
            {showModal
              ? ` | ${
                  readOnlyMode && automatedJob
                    ? initialValues.name
                    : editMode
                    ? `Update Automated Job`
                    : `Create Automated Job`
                } `
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={
          readOnlyMode && automatedJob
            ? initialValues.name
            : editMode
            ? "Update Automated Job"
            : "Create Automated Job"
        }
        id="addJob"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-lg-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !editMode })}>Name</span>
              </label>
              <input
                disabled={readOnlyMode}
                type="text"
                {...formik.getFieldProps("name")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  { "is-invalid": formik.touched.name && formik.errors.name },
                  {
                    "is-valid": formik.touched.name && !formik.errors.name,
                  }
                )}
                placeholder="Enter Automated Job Name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="fv-row row mb-5">
                <label className="form-label fw-bold">State</label>
                <div className="col-6">
                  <div data-kt-buttons="true">
                    <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success w-100">
                      <div className="d-flex align-items-center justify-content-evenly">
                        <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                          <input
                            disabled={readOnlyMode}
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
                <div className="col-6">
                  <div data-kt-buttons="true">
                    <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-danger w-100">
                      <div className="d-flex align-items-center justify-content-evenly">
                        <div className="form-check form-check-custom form-check-solid form-check-danger pe-1">
                          <input
                            disabled={readOnlyMode}
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
              </div>
              {formik.touched.isActive && formik.errors.isActive && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.isActive}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row row mb-5">
            <div className="col-lg-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !editMode })}>
                  Cron Expression
                </span>
              </label>
              <Select
                isDisabled={readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appCronExpressionId &&
                      formik.errors.appCronExpressionId,
                  },
                  {
                    "is-valid":
                      formik.touched.appCronExpressionId &&
                      !formik.errors.appCronExpressionId,
                  }
                )}
                options={optionState.appCronExpressionId}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "appCronExpressionId",
                    option ? option.value : null
                  );
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      appCronExpressionId: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.appCronExpressionId}
                placeholder={"Cron Expression"}
              />
              {formik.touched.appCronExpressionId &&
                formik.errors.appCronExpressionId && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">
                      {formik.errors.appCronExpressionId}
                    </span>
                  </div>
                )}
            </div>
            <div className="col-lg-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !editMode })}>
                  Smart Function
                </span>
              </label>
              <Select
                isDisabled={readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appSmartFunctionId &&
                      formik.errors.appSmartFunctionId,
                  },
                  {
                    "is-valid":
                      formik.touched.appSmartFunctionId &&
                      !formik.errors.appSmartFunctionId,
                  }
                )}
                options={optionState.appSmartFunctionId}
                isMulti={false}
                onChange={(option) => {
                  getSmartFunctionParameters(option?.value);
                  formik.setFieldValue(
                    "appSmartFunctionId",
                    option ? option.value : null
                  );
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      appSmartFunctionId: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.appSmartFunctionId}
                placeholder={"Smart Function"}
              />
              {formik.touched.appSmartFunctionId &&
                formik.errors.appSmartFunctionId && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.appSmartFunctionId}</span>
                  </div>
                )}
            </div>
          </div>
          {parameters.length > 0 && (
            <>
              <div className="fv-row mb-5">
                <label className="form-label fs-6 fw-bolder text-dark">
                  Parameters
                </label>
                <div className="fv-row row mb-5">
                  {parameters?.map((param, index) => {
                    return (
                      <div
                        key={index}
                        className={clsx("col-lg-6", {
                          "mb-5":
                            index + 1 < parameters.length &&
                            (index + 1) % 2 === 0,
                        })}
                      >
                        <div className="badge badge-light badge-light-primary text-gray-700 p-3 mb-3">
                          <span
                            className={clsx({
                              required: param.required,
                            })}
                          >
                            {param.name}
                          </span>
                        </div>
                        <input
                          {...formik.getFieldProps(`parameters.${param.name}`)}
                          disabled={readOnlyMode}
                          type="text"
                          className={"form-control bg-transparent py-2"}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !editMode })}>Description</span>
            </label>
            <textarea
              disabled={readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("description")}
              rows={5}
              placeholder="Description for automated job"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.description}</span>
              </div>
            )}
          </div>
          {!readOnlyMode && (
            <>
              <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10 pt-5">
                <LoadingButton
                  btnText={editMode ? "Update" : "Submit"}
                  loading={loading}
                  disableBtn={formik.isSubmitting || !formik.isValid || loading}
                  btnClass={"btn btn-primary me-4"}
                />
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                  disabled={formik.isSubmitting || loading}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </ModalComponent>
    </>
  );
};
