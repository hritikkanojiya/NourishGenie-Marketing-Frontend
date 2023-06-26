import { FC, useEffect, useState } from "react";
import { StepProps } from "../../../models/campaign.model";
import Select from "react-select";
import { Option } from "../../../../../common/globals/common.model";
import { FlowService } from "../../../../msg91/services/flow/flow.service";
import { SenderService } from "../../../../msg91/services/sender/sender.service";

export const SMSStepper: FC<StepProps> = ({ formik, hasError, services }) => {
  const [flowIdsOptions, setFlowIds] = useState<Option[]>([]);
  const [senderIdOptions, setSenderIdsOptions] = useState<Option[]>([]);
  const [selectState, setSelectState] = useState<{
    flowId: Option;
    senderId: Option;
  }>({
    flowId: { label: "Choose One", value: null },
    senderId: { label: "Choose One", value: null },
  });

  const getFlowIds = async () => {
    const request = await FlowService.getFlow({
      metaData: { fields: ["appMSG91FlowId", "flowName"] },
    });
    if ("data" in request) {
      const options = request.data.MSG91Flows?.map((flow) => {
        return { label: flow.flowName, value: flow.appMSG91FlowId };
      });
      setFlowIds(options);
    }
  };

  const getSibSenderIds = async () => {
    const request = await SenderService.getSenders({
      metaData: { fields: ["appMSG91SenderId", "MSG91SenderId"] },
    });
    if ("data" in request) {
      const options = request.data.MSG91Senders?.map((sender) => {
        return { label: sender.MSG91SenderId, value: sender.appMSG91SenderId };
      });
      setSenderIdsOptions(options);
    }
  };

  useEffect(() => {
    getSibSenderIds();
    getFlowIds();
  }, []);

  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="w-100">
        {services && services.includes("msg91") && (
          <>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">MSG91 Flow ID</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify your unique app name"
                ></i>
              </label>
              <Select
                options={flowIdsOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  formik.setFieldValue(
                    "platforms.sms.msg91.appMSG91FlowId",
                    options?.value
                  );
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      flowId: {
                        label: options?.label || "",
                        value: options?.value,
                      },
                    };
                  });
                }}
                value={selectState.flowId}
              />
            </div>

            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">MSG91 Sender ID</span>
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
                    "platforms.sms.config.senderId",
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
