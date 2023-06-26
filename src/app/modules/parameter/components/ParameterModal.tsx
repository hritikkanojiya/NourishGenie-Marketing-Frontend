/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { Option } from "../../../common/globals/common.model";
import { ModalComponent } from "../../../common/components/modal/Modal";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../common/toastify/toastify.config";
import { AppParameter } from "../models/app_parameter.model";
import { AppParameterService } from "../services/app_parameter.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const createAppParameterSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  config: Yup.object().shape({
    category: Yup.string()
      .trim()
      .oneOf(["MARKETING", "CONTACT"])
      .required("Category is required"),
    type: Yup.string().trim().oneOf(["STATIC", "DYNAMIC", null]).nullable(),
    value: Yup.string().trim().nullable(),
    default: Yup.string().trim().nullable(),
  }),
});

type ParamPaylod = {
  name: string;
  description: string;
  config: {
    category: string;
    default: string | null;
    type: string | null;
    value: string | null;
  };
};

let initialValues: ParamPaylod = {
  name: "",
  description: "",
  config: {
    category: "",
    default: null,
    type: null,
    value: null,
  },
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appParameter?: AppParameter | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appParameter?: AppParameter | {};
};

export const AppParameterModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  appParameter,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    appParameter: undefined,
  });
  const [selectState, setSelectState] = useState<{
    category: Option;
    type: Option;
  }>({
    category: { label: "Choose One", value: null },
    type: {
      label: "Choose One",
      value: null,
    },
  });
  const CategoryOptions = [
    {
      value: "CONTACT",
      label: "CONTACT",
    },
    {
      value: "MARKETING",
      label: "MARKETING",
    },
  ];

  const TypeOptions = [
    {
      value: "STATIC",
      label: "STATIC",
    },
    {
      value: "DYNAMIC",
      label: "DYNAMIC",
    },
  ];

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createAppParameterSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const appParameterDetails: any = {
        name: values.name,
        config: {
          category: values.config.category,
          default: values.config.default || null,
          type: values.config.type || null,
          value: values.config.value || null,
        },
        description: values.description,
      };
      if (!state.editMode) {
        const request = await AppParameterService.createAppParameter(
          appParameterDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.appParameter && "name" in state.appParameter) {
          appParameterDetails.appParameterId =
            state.appParameter.appParameterId || "";
          const request = await AppParameterService.updateAppParameters(
            appParameterDetails
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

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "config.value") {
      formik.setFieldValue("config.value", value);
      if (!formik.touched.config?.default)
        formik.setFieldValue("config.default", value);
    } else {
      formik.setFieldValue("config.default", value);
    }
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
    if ((editMode || readOnlyMode) && appParameter) {
      if ("name" in appParameter) {
        setState((prevState) => {
          return { ...prevState, appParameter: appParameter };
        });
        initialValues = {
          name: appParameter.name,
          config: {
            category: appParameter.config.category,
            default: appParameter.config.default,
            type: appParameter.config.default,
            value: appParameter.config.default,
          },
          description: appParameter.description,
        };
        setSelectState({
          category: {
            label: appParameter.config.category,
            value: appParameter.config.category,
          },
          type: {
            label: appParameter.config.type || "",
            value: appParameter.config.type,
          },
        });
      }
    } else {
      initialValues = {
        name: "",
        config: {
          category: "",
          default: "",
          type: "",
          value: null,
        },
        description: "",
      };
      setSelectState({
        category: { label: "Choose One", value: null },
        type: { label: "Choose One", value: null },
      });
    }
  }, [showModal, editMode, readOnlyMode, appParameter]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Parameters
            {showModal
              ? ` | ${
                  state.readOnlyMode && appParameter
                    ? initialValues.name
                    : state.editMode
                    ? `Update Parameter`
                    : `Create Parameter`
                }`
              : ""}
          </title>
        </Helmet>
      )}

      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && appParameter
            ? initialValues.name
            : state.editMode
            ? "Update Parameter"
            : "Create Parameter"
        }
        id="addParameter"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Name</span>
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
              placeholder="Enter parameter name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row row mb-5">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Category
                </span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.config?.default &&
                      formik.errors.config?.default,
                  },
                  {
                    "is-valid":
                      formik.touched.config?.default &&
                      !formik.errors.config?.default,
                  }
                )}
                options={CategoryOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "config.category",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, category: { label, value } };
                  });
                }}
                value={selectState.category}
              />
              {formik.touched.config?.category &&
                formik.errors.config?.category && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.config?.category}</span>
                  </div>
                )}
            </div>
            {formik.values.config.category !== "CONTACT" && (
              <div className="col-6">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span
                    className={clsx({
                      required:
                        !state.editMode ||
                        formik.values.config.category !== "CONTACT",
                    })}
                  >
                    Type
                  </span>
                </label>
                <Select
                  isDisabled={
                    state.readOnlyMode ||
                    formik.values.config.category === "CONTACT"
                  }
                  className={clsx(
                    "is-invalid",
                    {
                      "is-invalid":
                        formik.touched.config?.type &&
                        formik.errors.config?.type,
                    },
                    {
                      "is-valid":
                        formik.touched.config?.type &&
                        !formik.errors.config?.type,
                    }
                  )}
                  options={TypeOptions}
                  isMulti={false}
                  onChange={(option) => {
                    formik.setFieldValue(
                      "config.type",
                      option ? option.value : null
                    );
                    const label = option?.label || "";
                    const value = option?.value;
                    setSelectState((prevState) => {
                      return { ...prevState, type: { label, value } };
                    });
                  }}
                  value={selectState.type}
                />
                {formik.touched.config?.type && formik.errors.config?.type && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.config?.type}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="fv-row row mb-5">
            {formik.values.config.category !== "CONTACT" && (
              <div className="col-6">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span
                    className={clsx({
                      required:
                        !state.editMode ||
                        formik.values.config.category !== "CONTACT",
                    })}
                  >
                    Default
                  </span>
                </label>
                <input
                  disabled={
                    state.readOnlyMode ||
                    formik.values.config.category === "CONTACT"
                  }
                  type="text"
                  {...formik.getFieldProps("config.default")}
                  className={clsx(
                    "form-control bg-transparent py-2",
                    {
                      "is-invalid":
                        formik.touched.config?.default &&
                        formik.errors.config?.default,
                    },
                    {
                      "is-valid":
                        formik.touched.config?.default &&
                        !formik.errors.config?.default,
                    }
                  )}
                  onChange={handleValueChange}
                  placeholder="Enter default"
                />
                {formik.touched.config?.default &&
                  formik.errors.config?.default && (
                    <div className="fv-plugins-message-container text-danger">
                      <span role="alert">{formik.errors.config?.default}</span>
                    </div>
                  )}
              </div>
            )}
            {formik.values.config.category !== "CONTACT" && (
              <div className="col-6">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span className={clsx({ required: !state.editMode })}>
                    Value
                  </span>
                </label>
                <input
                  disabled={
                    state.readOnlyMode ||
                    formik.values.config.category === "CONTACT"
                  }
                  type="text"
                  {...formik.getFieldProps("config.value")}
                  className={clsx(
                    "form-control bg-transparent py-2",
                    {
                      "is-invalid":
                        formik.touched.config?.value &&
                        formik.errors.config?.value,
                    },
                    {
                      "is-valid":
                        formik.touched.config?.value &&
                        !formik.errors.config?.value,
                    }
                  )}
                  onChange={handleValueChange}
                  placeholder="Enter value"
                />
                {formik.touched.config?.value && formik.errors.config?.value && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.config?.value}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="fv-row">
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
              placeholder="Description for the list"
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
