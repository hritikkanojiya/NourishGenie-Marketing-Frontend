/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { SendInBlueTemplate } from "../../models/sendinblue_template.model";
import { TextEditor } from "../../../../common/components/ckeditor/Editor";
import { SendInBlueTemplateService } from "../../services/sendinblue_templates.service";
import Select from "react-select";
import { Option } from "../../../../common/globals/common.model";
import { SendInBlueSenderService } from "../../services/sendinblue_sender.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createSenderSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  subject: Yup.string().trim().required("Subject is required"),
  tag: Yup.string().trim().required("Tag is required"),
  appSendInBlueSenderId: Yup.string()
    .trim()
    .required("appSendInBlueSenderId is required"),
  replyTo: Yup.string().trim().required("Reply To is required"),
  toField: Yup.string().trim().required("To Field is required"),
  htmlContent: Yup.string().trim().required("HTML Content is required"),
  attachmentUrl: Yup.string().trim().nullable(),
});

let initialValues: SendInBlueTemplate = {
  name: "",
  subject: "",
  tag: "",
  appSendInBlueTemplateId: "",
  replyTo: "admin@poojamakhija.com",
  toField: "{{ contact.FIRSTNAME }} {{ contact.LASTNAME }}",
  htmlContent: "",
  attachmentUrl: "",
  appSendInBlueSenderId: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  templateId?: string;
  templateDetails: SendInBlueTemplate | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  templateId?: string;
  templateDetails: SendInBlueTemplate | {};
};

export const SendInBlueTemplateModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  templateId,
  closeModal,
  templateDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    templateId: undefined,
    templateDetails: {},
  });
  const [senderIdOptions, setSenderIdOptions] = useState<Option[]>([]);
  const [selectSenderId, setSelectSenderId] = useState<Option>({
    label: "Choose One",
    value: null,
  });
  const [, setEditorData] = useState("");

  const getSenderIds = async () => {
    const request = await SendInBlueSenderService.getSenders({
      metaData: { fields: ["name", "appSendInBlueSenderId"] },
    });
    if ("data" in request) {
      const options = request.data.sendInBlueSenders?.map((sender) => {
        return { label: sender.name, value: sender.appSendInBlueSenderId };
      });
      setSenderIdOptions(options);
    }
  };

  const handleEditorData = (data: string) => {
    setEditorData(data);
  };

  const getTemplateDetails = async (templateId: string) => {
    const request = await SendInBlueTemplateService.getTemplates({
      appSendInBlueTemplateId: templateId,
      metaData: { fields: ["htmlContent"] },
    });
    if ("data" in request && request.data.sendInBlueTemplates?.length > 0) {
      const template = request.data.sendInBlueTemplates[0];
      initialValues = { ...initialValues, htmlContent: template.htmlContent };
      handleEditorData(template.htmlContent);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSenderSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const templateDetails: any = {
        name: values.name,
        subject: values.subject,
        tag: values.tag,
        appSendInBlueSenderId: values.appSendInBlueSenderId,
        replyTo: values.replyTo,
        toField: values.toField,
        htmlContent: values.htmlContent,
        attachmentUrl: values.attachmentUrl || null,
      };
      if (!state.editMode) {
        const request = await SendInBlueTemplateService.createTemplates(
          templateDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.templateId && state.templateId?.length > 0) {
          templateDetails.appSendInBlueTemplateId = templateId;
          const request = await SendInBlueTemplateService.updateTemplates(
            templateDetails
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

  useEffect(() => {
    getSenderIds();
  }, []);

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
    if ((editMode || readOnlyMode) && templateId && "name" in templateDetails) {
      initialValues = {
        appSendInBlueSenderId: templateDetails.appSendInBlueSenderId,
        attachmentUrl: templateDetails.attachmentUrl,
        htmlContent: "",
        name: templateDetails.name,
        replyTo: templateDetails.replyTo,
        subject: templateDetails.subject,
        tag: templateDetails.tag,
        toField: templateDetails.toField,
      };
      const sender = senderIdOptions?.find(
        (sender) => sender.value === templateDetails.appSendInBlueSenderId
      );
      setSelectSenderId({ label: sender?.label || "", value: sender?.value });
      getTemplateDetails(templateId);
    } else {
      initialValues = {
        attachmentUrl: "",
        htmlContent: "",
        name: "",
        replyTo: "",
        subject: "",
        tag: "",
        toField: "{{ contact.FIRSTNAME }} {{ contact.LASTNAME }}",
        appSendInBlueSenderId: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, templateId]);
  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | SendInBlue Templates
            {showModal
              ? ` | ${state.readOnlyMode && templateId
                ? initialValues.name
                : state.editMode
                  ? `Update SendInBlue Template`
                  : `Create SendInBlue Template`
              }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && templateId
            ? initialValues.name
            : state.editMode
              ? "Update SendInBlue Template"
              : "Create SendInBlue Template"
        }
        id="addRoute"
        modalSize="modal-lg"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-8">
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
                placeholder="Enter Template Name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              )}
            </div>
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  SendInBlue Sender
                </span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appSendInBlueSenderId &&
                      formik.errors.appSendInBlueSenderId,
                  },
                  {
                    "is-valid":
                      formik.touched.appSendInBlueSenderId &&
                      !formik.errors.appSendInBlueSenderId,
                  }
                )}
                options={senderIdOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "appSendInBlueSenderId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectSenderId({ label, value });
                }}
                value={selectSenderId}
              />
              {formik.touched.tag && formik.errors.tag && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.tag}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Subject
              </span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("subject")}
              rows={5}
              placeholder="Subject"
            ></textarea>
            {formik.touched.subject && formik.errors.subject && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.subject}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Tag</span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("tag")}
              className={clsx(
                "form-control bg-transparent py-2",
                { "is-invalid": formik.touched.tag && formik.errors.tag },
                {
                  "is-valid": formik.touched.tag && !formik.errors.tag,
                }
              )}
              placeholder="Enter Tag"
            />
            {formik.touched.tag && formik.errors.tag && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.tag}</span>
              </div>
            )}
          </div>
          <div className="fv-row row mb-5">
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Preview Subject
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("toField")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.toField && formik.errors.toField,
                  },
                  {
                    "is-valid":
                      formik.touched.toField && !formik.errors.toField,
                  }
                )}
                placeholder="Enter To Subject"
              />
              {formik.touched.toField && formik.errors.toField && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.toField}</span>
                </div>
              )}
            </div>
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Reply To Email
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("replyTo")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.replyTo && formik.errors.replyTo,
                  },
                  {
                    "is-valid":
                      formik.touched.replyTo && !formik.errors.replyTo,
                  }
                )}
                placeholder="Enter Reply To Email"
              />
              {formik.touched.replyTo && formik.errors.replyTo && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.replyTo}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Attachment URL
              </span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("attachmentUrl")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.attachmentUrl && formik.errors.attachmentUrl,
                },
                {
                  "is-valid":
                    formik.touched.attachmentUrl &&
                    !formik.errors.attachmentUrl,
                }
              )}
              placeholder="Enter Attachment URL"
            />
            {formik.touched.attachmentUrl && formik.errors.attachmentUrl && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.attachmentUrl}</span>
              </div>
            )}
          </div>
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                HTML Content
              </span>
            </label>
            <TextEditor
              data={formik.values.htmlContent}
              disabled={readOnlyMode}
              onChange={(event, editor) => {
                const data = editor.getData();
                formik.setFieldValue("htmlContent", data);
              }}
            />
            {formik.touched.htmlContent && formik.errors.htmlContent && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.htmlContent}</span>
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
