/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../../common/toastify/toastify.config";
import { MSG91Flow } from "../../models/flow/flow.model";
import { Option } from "../../../../common/globals/common.model";
import { SenderService } from "../../services/sender/sender.service";
import { FlowService } from "../../services/flow/flow.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createMSG91FlowSchema = Yup.object().shape({
  MSG91SenderId: Yup.string().trim().required("MSG91SenderId is required"),
  flowName: Yup.string().trim().required("Flow name is required"),
  smsType: Yup.number().min(1).required("SMS type is required"),
  receiver: Yup.string().trim().required("Receiver is required"),
  message: Yup.string().trim().required("Message is required"),
  dltTemplateId: Yup.string().trim().required("dltTemplateId is required"),
  description: Yup.string().trim().required("Description is required"),
  requestType: Yup.string()
    .trim()
    .oneOf(["EXISTING", "FRESH"])
    .required("Request type is required"),
  existingFlowId: Yup.string()
    .trim()
    .when("requestType", {
      is: "EXISTING",
      then: Yup.string().trim().required("Existing flow ID is required"),
      otherwise: Yup.string().trim().default(null).nullable(),
    }),
});

let initialValues: MSG91Flow = {
  MSG91SenderId: "",
  flowName: "",
  message: "",
  dltTemplateId: "",
  description: "",
  requestType: "",
  existingFlowId: "",
};

type Props = {
  showModal: boolean;
  readOnlyMode: boolean;
  flow?: MSG91Flow | {};
  closeModal: () => void;
};

type FlowOperationState = {
  showModal: boolean;
  readOnlyMode: boolean;
  flow?: MSG91Flow | {};
};

export const MSG91FlowModal: FC<Props> = ({
  showModal,
  readOnlyMode,
  flow,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<FlowOperationState>({
    showModal: false,
    readOnlyMode: false,
    flow: undefined,
  });
  const [optionState, setOptionState] = useState<{
    senderId: Option[];
    requestType: Option[];
  }>({ requestType: [], senderId: [] });
  const [selectState, setSelectState] = useState<{
    senderId: Option;
    requestType: Option;
  }>({
    requestType: { label: "Choose One", value: null },
    senderId: { label: "Choose One", value: null },
  });

  const requestTypeOptions = [
    { label: "FRESH", value: "FRESH" },
    { label: "EXISTING", value: "EXISTING" },
  ];

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createMSG91FlowSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const request = await FlowService.createFlow(values);
      if ("data" in request) {
        showToast(request.data.message, "success");
        closeModal();
      }
      setLoading(false);
    },
  });

  const getSenderIds = async () => {
    const request = await SenderService.getSenders({
      metaData: { fields: ["MSG91SenderId"] },
    });
    if ("data" in request) {
      const options = request.data.MSG91Senders?.map((sender) => {
        return { label: sender.MSG91SenderId, value: sender.MSG91SenderId };
      });
      setOptionState((prevState) => {
        return { ...prevState, senderId: options };
      });
    }
  };

  useEffect(() => {
    getSenderIds();
  }, []);

  useEffect(() => {
    setState((prevState) => {
      return { ...prevState, readOnlyMode: readOnlyMode, showModal: showModal };
    });
    formik.resetForm();
    if (readOnlyMode && flow) {
      if ("MSG91FlowId" in flow) {
        setState((prevState) => {
          return { ...prevState, flow: flow };
        });
        initialValues = {
          MSG91SenderId: flow.MSG91FlowId || "",
          flowName: flow.flowName,
          message: flow.message,
          dltTemplateId: flow.dltTemplateId,
          description: flow.description,
          requestType: flow.requestType,
          existingFlowId: flow.existingFlowId,
        };
        const senderId = optionState.senderId.find(
          (sender) => sender.value === flow.MSG91SenderId
        );
        const requestTypeId = {
          label: flow.requestType,
          value: flow.requestType,
        };
        if (senderId)
          setSelectState({ requestType: requestTypeId, senderId: senderId });
      }
    } else {
      initialValues = {
        MSG91SenderId: "",
        flowName: "",
        message: "",
        dltTemplateId: "",
        description: "",
        requestType: "",
        existingFlowId: "",
      };
      setSelectState({
        requestType: { label: "Choose One", value: null },
        senderId: { label: "Choose One", value: null },
      });
    }
  }, [showModal, readOnlyMode, flow]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | MSG91 Flows
            {showModal
              ? ` | ${state.readOnlyMode && flow
                ? initialValues.flowName
                : `Create MSG91 Flow`
              }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && flow ? initialValues.flowName : "Create MSG91 Flow"
        }
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Name</span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("flowName")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.flowName && formik.errors.flowName,
                },
                {
                  "is-valid":
                    formik.touched.flowName && !formik.errors.flowName,
                }
              )}
              placeholder="Enter flow name"
            />
            {formik.touched.flowName && formik.errors.flowName && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.flowName}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Description</span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("description")}
              rows={5}
              placeholder="Description"
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
                <span className={clsx("required")}>MSG91SenderId</span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.MSG91SenderId &&
                      formik.errors.MSG91SenderId,
                  },
                  {
                    "is-valid":
                      formik.touched.MSG91SenderId &&
                      !formik.errors.MSG91SenderId,
                  }
                )}
                options={optionState.senderId}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "MSG91SenderId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, senderId: { label, value } };
                  });
                }}
                value={selectState.senderId}
              />
              {formik.touched.MSG91SenderId && formik.errors.MSG91SenderId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.MSG91SenderId}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx("required")}>Request Type</span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.requestType && formik.errors.requestType,
                  },
                  {
                    "is-valid":
                      formik.touched.requestType && !formik.errors.requestType,
                  }
                )}
                options={requestTypeOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "requestType",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, requestType: { label, value } };
                  });
                }}
                value={selectState.requestType}
              />
              {formik.touched.requestType && formik.errors.requestType && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.requestType}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row row mb-5">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx("required")}>dltTemplateId</span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("dltTemplateId")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.dltTemplateId &&
                      formik.errors.dltTemplateId,
                  },
                  {
                    "is-valid":
                      formik.touched.dltTemplateId &&
                      !formik.errors.dltTemplateId,
                  }
                )}
                placeholder="Enter dltTemplateId"
              />
              {formik.touched.dltTemplateId && formik.errors.dltTemplateId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.dltTemplateId}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span
                  className={clsx({
                    required: formik.values.requestType === "EXISTING",
                  })}
                >
                  Existing MSG91 FlowId
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("existingFlowId")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.existingFlowId &&
                      formik.errors.existingFlowId,
                  },
                  {
                    "is-valid":
                      formik.touched.existingFlowId &&
                      !formik.errors.existingFlowId,
                  }
                )}
                placeholder="Enter MSG91 FlowId"
              />
              {formik.touched.existingFlowId && formik.errors.existingFlowId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.existingFlowId}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Message</span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("message")}
              rows={5}
              placeholder="Message"
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.message}</span>
              </div>
            )}
          </div>
          {!readOnlyMode && (
            <>
              <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10 pt-5">
                <LoadingButton
                  btnText={"Submit"}
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
