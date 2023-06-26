/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { SmartFunctionService } from "../../services/smart_functions.service";
import { SmartFunction } from "../../models/smart_functions.model";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createSmartFunctionSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  parameters: Yup.array().of(
    Yup.object().shape({
      parameterName: Yup.string().trim(),
      required: Yup.boolean(),
    })
  ),
});

let initialValues = {
  name: "",
  description: "",
  parameters: [
    { parameterName: "", required: false },
    { parameterName: "", required: false },
  ],
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  smartFunction?: SmartFunction | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  smartFunction?: SmartFunction | {};
};

export const SmartFunctionModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  smartFunction,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    smartFunction: undefined,
  });
  const [,] = useState([{ parameterName: "", required: false }]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSmartFunctionSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const functionDetail: any = {
        name: values.name,
        description: values.description,
        parameters: values.parameters,
      };
      if (!state.editMode) {
        const request = await SmartFunctionService.createSmartFunction(
          functionDetail
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.smartFunction && "name" in state.smartFunction) {
          functionDetail.parameters = functionDetail.parameters?.map(
            (param: any) => {
              return {
                parameterName: param.parameterName,
                required: param.required,
              };
            }
          );
          functionDetail.appSmartFunctionId =
            state.smartFunction.appSmartFunctionId || "";
          const request = await SmartFunctionService.updateSmartFunction(
            functionDetail
          );
          if ("data" in request) {
            showToast(request.data.message, "success");
            closeModal();
          }
        }
      }
      setLoading(false);
    },
  });

  const addParameters = () => {
    formik.setValues({
      ...formik.values,
      parameters: [
        ...formik.values.parameters,
        { parameterName: "", required: false },
      ],
    });
  };

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        editMode: editMode,
        readOnlyMode: readOnlyMode,
        showModal: showModal,
      };
    });
    formik.resetForm();
    if ((editMode || readOnlyMode) && smartFunction) {
      if ("name" in smartFunction) {
        setState((prevState) => {
          return { ...prevState, smartFunction: smartFunction };
        });
        initialValues = {
          name: smartFunction.name,
          description: smartFunction.description,
          parameters: smartFunction.parameters,
        };
      }
    } else {
      initialValues = {
        name: "",
        description: "",
        parameters: [{ parameterName: "", required: false }],
      };
    }
  }, [showModal, editMode, readOnlyMode, smartFunction]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Smart Functions
            {showModal
              ? ` | ${
                  readOnlyMode && smartFunction
                    ? initialValues.name
                    : editMode
                    ? `Update Smart Function`
                    : `Create Smart Function`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && smartFunction
            ? initialValues.name
            : state.editMode
            ? "Update Smart Function"
            : "Create Smart Function"
        }
        id="addFunction"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-9">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Name
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("name")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  { "is-invalid": formik.touched.name && formik.errors.name },
                  {
                    "is-valid": formik.touched.name && !formik.errors.name,
                  }
                )}
                placeholder="Enter smart function name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              )}
            </div>
            {!readOnlyMode && (
              <div className="col-3 mt-auto">
                <label className="form-label fs-6 fw-bolder text-dark">
                  Parameter
                </label>
                <button
                  type="button"
                  className="btn btn-outline btn-outline-success py-2"
                  onClick={addParameters}
                  disabled={loading}
                >
                  Create
                </button>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Parameters
              </span>
            </label>
            {formik.values.parameters?.map((param, index) => {
              return (
                <>
                  <div key={index} className="fv-row row mb-3">
                    <div className="col-6">
                      <input
                        disabled={readOnlyMode}
                        {...formik.getFieldProps(
                          `parameters[${index}].parameterName`
                        )}
                        type="text"
                        className="form-control bg-transparent py-2"
                        placeholder="Enter parameter name"
                      />
                    </div>
                    <div className="col-4 text-center m-auto">
                      <div className="fv-row row">
                        <div className="col-6">
                          <div data-kt-buttons="true">
                            <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success px-2 w-100">
                              <div className="d-flex align-items-center justify-content-evenly">
                                <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                                  <input
                                    {...formik.getFieldProps(
                                      `parameters[${index}].required`
                                    )}
                                    disabled={readOnlyMode}
                                    checked={
                                      formik.values.parameters[index].required
                                    }
                                    className="form-check-input w-15px h-15px"
                                    type="radio"
                                  />
                                </div>
                                <div className="fw-bold">Yes</div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="col-6">
                          <div data-kt-buttons="true">
                            <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-danger px-2 w-100">
                              <div className="d-flex align-items-center justify-content-evenly">
                                <div className="form-check form-check-custom form-check-solid form-check-danger pe-1">
                                  <input
                                    {...formik.getFieldProps(
                                      `parameters[${index}].required`
                                    )}
                                    disabled={readOnlyMode}
                                    checked={
                                      !formik.values.parameters[index].required
                                    }
                                    className="form-check-input w-15px h-15px"
                                    type="radio"
                                  />
                                </div>
                                <div className="fw-bold">No</div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <span className="small fw-bold text-muted mt-1">
                          Required
                        </span>
                      </div>
                    </div>
                    <div className="col-2 text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-icon btn-outline border-dashed btn-outline-danger"
                      >
                        <i className="fa fa-trash fs-3 text-danger"></i>
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
          <div className="fv-row mt-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Description
              </span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("description")}
              rows={5}
              placeholder="Description for smart function"
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
                  btnText={state.editMode ? "Update" : "Submit"}
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
