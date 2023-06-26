import { FC, useEffect, useState } from "react";
import { StepProps } from "../../../models/campaign.model";
import Select from "react-select";
import { SendInBlueTemplateService } from "../../../../sendinblue/services/sendinblue_templates.service";
import { Option } from "../../../../../common/globals/common.model";
import { SendInBlueSenderService } from "../../../../sendinblue/services/sendinblue_sender.service";

export const EmailStepper: FC<StepProps> = ({ formik, hasError, services }) => {
  const [templateIdsOptions, setTemplateIdsOptions] = useState<Option[]>([]);
  const [senderIdOptions, setSenderIdsOptions] = useState<Option[]>([]);
  const [selectState, setSelectState] = useState<{
    templateId: Option;
    senderId: Option;
  }>({
    templateId: { label: "Choose one", value: null },
    senderId: { label: "Choose One", value: null },
  });

  const getSibTemplateIds = async () => {
    const request = await SendInBlueTemplateService.getTemplates({
      isTestSent: true,
      metaData: { fields: ["appSendInBlueTemplateId", "name"], limit: -1 },
    });
    if ("data" in request) {
      const options = request.data.sendInBlueTemplates?.map((template) => {
        return {
          label: template.name,
          value: template.appSendInBlueTemplateId,
        };
      });
      setTemplateIdsOptions(options);
    }
  };

  const getSibSenderIds = async () => {
    const request = await SendInBlueSenderService.getSenders({
      metaData: { fields: ["appSendInBlueSenderId", "name"] },
    });
    if ("data" in request) {
      const options = request.data.sendInBlueSenders?.map((sender) => {
        return { label: sender.name, value: sender.appSendInBlueSenderId };
      });
      setSenderIdsOptions(options);
    }
  };

  useEffect(() => {
    getSibSenderIds();
    getSibTemplateIds();
  }, []);

  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="w-100">
        {services && services.includes("sendInBlue") && (
          <>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">SendInBlue Template ID</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify your unique app name"
                ></i>
              </label>
              <Select
                options={templateIdsOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  formik.setFieldValue(
                    "platforms.email.sendInBlue.appSendInBlueTemplateId",
                    options?.value
                  );
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
                value={selectState.templateId}
              />
            </div>

            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">SendInBlue Sender ID</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify your unique app name"
                ></i>
              </label>
              <Select
                options={senderIdOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  formik.setFieldValue(
                    "platforms.email.config.senderId",
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
                value={selectState.senderId}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
