import { FC, useEffect, useState } from "react";
import { StepProps } from "../../../models/campaign.model";
import { WabaTemplateService } from "../../../../valuefirst/services/wabaTemplate.service";
import { Option } from "../../../../../common/globals/common.model";
import { WABASenderService } from "../../../../waba/services/waba_sender.service";
import Select from "react-select";
import { showToast } from "../../../../../common/toastify/toastify.config";

type TemplateData = {
  header: string;
  body: string;
  footer: string;
};

type SelectState = {
  templateId: Option;
  senderId: Option;
  mediaURL: string;
};

export const WhatsAppStep: FC<StepProps> = ({ formik, hasError, services }) => {
  const [templateOptions, setTemplateOptions] = useState<Option[]>([]);
  const [senderOptions, setSenderOptions] = useState<Option[]>([]);
  const [showMediaURL, setShowMediaURL] = useState(false);
  const [preview, setPreview] = useState(false);
  const [templateData, setTemplateData] = useState<TemplateData>({
    body: "",
    footer: "",
    header: "",
  });
  const [selectState, setSelectState] = useState<SelectState>({
    mediaURL: "",
    senderId: {
      label: "Select one",
      value: null,
    },
    templateId: {
      label: "Select one",
      value: null,
    },
  });

  const getWABATemplates = async () => {
    const request = await WabaTemplateService.getTemplates({
      metaData: { fields: ["appWABAValueFirstTemplateId", "name"], limit: -1 },
      status: "APPROVED",
      isTestSent: true,
    });
    if ("data" in request && "message" in request.data) {
      const options = request.data.WABATemplates.map((template) => {
        return {
          label: template.name,
          value: template.appWABAValueFirstTemplateId,
        };
      });
      setTemplateOptions(options);
    }
  };

  const getWABASenders = async () => {
    const request = await WABASenderService.getSenders({
      metaData: { fields: ["appWABASenderId", "name"], limit: -1 },
      provider: "ValueFirst",
    });
    if ("data" in request && "message" in request.data) {
      const options = request.data.WABASenders.map((sender) => {
        return {
          label: sender.name,
          value: sender.appWABASenderId,
        };
      });
      setSenderOptions(options);
    }
  };

  const checkWABATemplate = async (wabaTemplateId: string) => {
    const request = await WabaTemplateService.getTemplates({
      appWABAValueFirstTemplateId: wabaTemplateId,
      metaData: { limit: 1 },
      type: "MEDIA",
    });
    if ("data" in request && "message" in request.data) {
      if (!(request.data.WABATemplates?.length > 0)) {
        setShowMediaURL(false);
        return;
      }
      const wabaTemplate = request.data.WABATemplates[0];
      const headerIsPresent = wabaTemplate.components.findIndex(
        (component) => component.componentType === "HEADER"
      );
      const footerIsPresent = wabaTemplate.components.findIndex(
        (component) => component.componentType === "FOOTER"
      );
      const bodyIndex = wabaTemplate.components.findIndex(
        (component) => component.componentType === "BODY"
      );
      if (bodyIndex === -1) {
        showToast("Invalid component detected", "error");
        return;
      }
      const bodyText = wabaTemplate.components[bodyIndex].metaData.payloadText;
      setTemplateData((prevState) => {
        return { ...prevState, body: bodyText };
      });
      if (footerIsPresent !== -1) {
        const footerText =
          wabaTemplate.components[footerIsPresent].metaData.payloadText;
        setTemplateData((prevState) => {
          return { ...prevState, footer: footerText };
        });
      }
      if (headerIsPresent === -1) {
        setShowMediaURL(false);
      }
      const headerFormat =
        wabaTemplate.components[headerIsPresent].metaData.format;
      const MEDIA_FORMAT = ["IMAGE", "DOCUMENT", "VIDEO"];
      if (MEDIA_FORMAT.includes(headerFormat)) {
        setShowMediaURL(true);
      } else {
        setShowMediaURL(false);
      }
    } else {
      showToast("Could not fetch WhatsApp template details.", "error");
      setShowMediaURL(false);
    }
  };

  useEffect(() => {
    getWABATemplates();
    getWABASenders();
  }, []);

  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="w-100">
        {services && services.includes("ValueFirst") && !preview && (
          <>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">WhatsApp Template ID</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                ></i>
              </label>
              <Select
                options={templateOptions}
                menuPosition="fixed"
                isMulti={false}
                value={selectState.templateId}
                onChange={(options) => {
                  formik.setFieldValue(
                    "platforms.whatsapp.valueFirst.appWABAValueFirstTemplateId",
                    options?.value
                  );
                  checkWABATemplate(options?.value);
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      templateId: {
                        label: options?.label || "",
                        value: options?.value,
                      },
                    };
                  });
                }}
              />
            </div>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">WhatsApp Sender ID</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                ></i>
              </label>
              <Select
                options={senderOptions}
                menuPosition="fixed"
                isMulti={false}
                value={selectState.senderId}
                onChange={(options) => {
                  formik.setFieldValue(
                    "platforms.whatsapp.config.appWABASenderId",
                    options?.value
                  );
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      senderId: {
                        label: options?.label || "",
                        value: options?.value,
                      },
                    };
                  });
                }}
              />
            </div>
            {showMediaURL && (
              <div className="fv-row mb-10">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span className="required">Media URL</span>
                  <i
                    className="fas fa-exclamation-circle ms-2 fs-7"
                    data-bs-toggle="tooltip"
                  ></i>
                </label>
                <input
                  type="text"
                  className={"form-control bg-transparent py-2"}
                  placeholder="Enter media URL"
                  value={selectState.mediaURL}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "platforms.whatsapp.appWABAValueFirstTemplateConfig.mediaURL",
                      e.target.value
                    );
                    setSelectState((prevState) => {
                      return {
                        ...prevState,
                        mediaURL: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            )}
          </>
        )}
        {preview && (
          <>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">WhatsApp Template Header</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                ></i>
              </label>

              <textarea
                disabled={true}
                className={"form-control bg-transparent py-2"}
                value={templateData.header}
                rows={2}
              ></textarea>
            </div>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">WhatsApp Template Body</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                ></i>
              </label>

              <textarea
                disabled={true}
                className={"form-control bg-transparent py-2"}
                value={templateData.body}
                rows={10}
              ></textarea>
            </div>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">WhatsApp Template Footer</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                ></i>
              </label>

              <textarea
                disabled={true}
                className={"form-control bg-transparent py-2"}
                value={templateData.footer}
                rows={2}
              ></textarea>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="btn btn-primary"
        >
          {!preview ? "Preview" : "Hide Preview"}
        </button>
      </div>
    </div>
  );
};
