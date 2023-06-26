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
import { WABASender, WABASenderPayload } from "../models/waba_sender.model";
import { WABASenderService } from "../services/waba_sender.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const numbersTest = (num: number | undefined): boolean => {
  if (!num) return true;
  const stringValue = String(num);
  return /^91[1-9]\d{9}$/.test(stringValue);
};

const createWABASenderSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  // api_key: Yup.string().trim().required("API Key is required"),
  api_key: Yup.string().when("provider", {
    is: "ValueFirst",
    then: Yup.string().nullable().default(null),
    otherwise: Yup.string().trim().required("API Key is required"),
  }),
  headers: Yup.array().of(Yup.string().trim()).default([]),
  mobile: Yup.number()
    .integer()
    .positive()
    .min(1, "Please enter a valid number")
    .test("minDigits", "Atleast 10 digits are required", numbersTest)
    .required("Mobile is required."),
  provider: Yup.string()
    .trim()
    .oneOf(["D360", "ValueFirst"])
    .required("Provider is required"),
});

let initialValues: WABASenderPayload = {
  name: "",
  description: "",
  api_key: "",
  headers: [],
  mobile: "",
  provider: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  WABASender?: WABASender | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  WABASender?: WABASender | {};
};

export const WABASenderModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  WABASender,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    WABASender: undefined,
  });
  const [selectState, setSelectState] = useState<{ provider: Option }>({
    provider: { label: "Choose One", value: null },
  });
  const providerOptions = [
    {
      value: "D360",
      label: "D360",
    },
    {
      value: "ValueFirst",
      label: "Value First",
    },
  ];

  const addHeader = () => {
    formik.setValues({
      ...formik.values,
      headers: [...formik.values.headers, ""],
    });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createWABASenderSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const headers = values.headers.filter((header) => header);
      let wabaSender: WABASenderPayload = {
        name: values.name,
        description: values.description,
        api_key: values.api_key,
        headers: headers,
        mobile: values.mobile.toString(),
        provider: values.provider,
      };
      if (!editMode) {
        const request = await WABASenderService.createSender(wabaSender);
        if ("data" in request && "message" in request.data) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (WABASender && "name" in WABASender) {
          wabaSender.appWABASenderId = WABASender.appWABASenderId;
          const request = await WABASenderService.updateSenders(wabaSender);
          if ("data" in request && "message" in request.data) {
            showToast(request.data.message, "success");
            closeModal();
          }
        }
      }
      setLoading(false);
    },
  });

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
    if ((editMode || readOnlyMode) && WABASender) {
      if ("name" in WABASender) {
        setState((prevState) => {
          return { ...prevState, WABASender: WABASender };
        });
        initialValues = {
          name: WABASender.name,
          description: WABASender.description,
          api_key: WABASender.api_key,
          headers: WABASender.headers,
          mobile: Number(WABASender.mobile),
          provider: WABASender.provider,
          appWABASenderId: WABASender.appWABASenderId,
        };
        const provider =
          WABASender.provider === "D360" ? "D360" : "Value First";
        setSelectState({
          provider: { label: provider, value: WABASender.provider },
        });
      }
    } else {
      initialValues = {
        api_key: "",
        description: "",
        headers: [],
        mobile: "",
        name: "",
        provider: "",
        appWABASenderId: "",
      };
      setSelectState({ provider: { label: "Choose One", value: null } });
    }
  }, [showModal, editMode, readOnlyMode, WABASender]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | WhatsApp Sender
            {showModal
              ? ` | ${
                  state.readOnlyMode && WABASender
                    ? initialValues.name
                    : state.editMode
                    ? `Update Sender`
                    : `Create Sender`
                }`
              : ""}
          </title>
        </Helmet>
      )}

      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && WABASender
            ? initialValues.name
            : state.editMode
            ? "Update Sender"
            : "Create Sender"
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
              placeholder="Enter sender's name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
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
              placeholder="Description for the sender"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.description}</span>
              </div>
            )}
          </div>
          <div className="fv-row row mb-5">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Provider
                </span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.provider && formik.errors.provider,
                  },
                  {
                    "is-valid":
                      formik.touched.provider && !formik.errors.provider,
                  }
                )}
                options={providerOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "provider",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, provider: { label, value } };
                  });
                }}
                value={selectState.provider}
              />
              {formik.touched.provider && formik.errors.provider && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.provider}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Mobile
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("mobile")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid": formik.touched.mobile && formik.errors.mobile,
                  },
                  {
                    "is-valid": formik.touched.mobile && !formik.errors.mobile,
                  }
                )}
                placeholder="Enter sender's mobile"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.mobile}</span>
                </div>
              )}
            </div>
          </div>
          {formik.values.provider !== "ValueFirst" &&
            formik.values.provider !== "" && (
              <div className="fv-row mb-5">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span className={clsx({ required: !state.editMode })}>
                    API Key
                  </span>
                </label>
                <textarea
                  disabled={state.readOnlyMode}
                  className="form-control bg-transparent"
                  {...formik.getFieldProps("api_key")}
                  rows={3}
                  placeholder="API Key of the sender"
                ></textarea>
                {formik.touched.api_key && formik.errors.api_key && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.api_key}</span>
                  </div>
                )}
              </div>
            )}
          {/* Hiding Headers Temporarily */}
          <div className="d-none">
            <label className="form-label fs-6 fw-bolder text-dark">
              Headers
            </label>
            <button
              type="button"
              className="btn btn-outline btn-outline-success py-2"
              onClick={addHeader}
              disabled={loading}
            >
              Create
            </button>
          </div>
          <div className="d-none fv-row row mb-5">
            <div className="col-6 mt-5">
              {!editMode && !readOnlyMode && (
                <input
                  disabled={state.readOnlyMode}
                  type="text"
                  {...formik.getFieldProps(`headers[0]`)}
                  className={clsx(
                    "form-control bg-transparent py-2",
                    {
                      "is-invalid":
                        formik.touched.headers &&
                        formik.errors.headers &&
                        formik.errors.headers[0],
                    },
                    {
                      "is-valid":
                        formik.touched.headers &&
                        formik.errors.headers &&
                        !formik.errors.headers[0],
                    }
                  )}
                  placeholder="Enter Header Value"
                />
              )}
              {formik.values.headers?.map((header, index) => {
                const i = editMode || readOnlyMode ? index : index + 1;
                return (
                  <>
                    <input
                      disabled={state.readOnlyMode}
                      type="text"
                      {...formik.getFieldProps(`headers.${i}`)}
                      className={clsx(
                        "form-control bg-transparent py-2 mt-2",
                        {
                          "is-invalid":
                            formik.touched.headers &&
                            formik.errors.headers &&
                            formik.errors.headers[i],
                        },
                        {
                          "is-valid":
                            formik.touched.headers &&
                            formik.errors.headers &&
                            !formik.errors.headers[i],
                        }
                      )}
                      placeholder="Enter Header Value"
                    />
                  </>
                );
              })}
              {formik.touched.headers && formik.errors.headers && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.headers}</span>
                </div>
              )}
            </div>
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
