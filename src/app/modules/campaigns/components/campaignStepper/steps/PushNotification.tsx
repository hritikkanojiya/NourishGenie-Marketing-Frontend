import { FC, useEffect, useState } from "react";
import { StepProps } from "../../../models/campaign.model";
import Select from "react-select";
import { Option } from "../../../../../common/globals/common.model";
import { FirebaseTemplateService } from "../../../../firebase/services/firebase.service";

export const PushNotificationStep: FC<StepProps> = ({
  formik,
  hasError,
  services,
}) => {
  const [firebaseTemplateIdOptions, setFirebaseTemplateIdOptions] = useState<
    Option[]
  >([]);
  const [selectState, setSelectState] = useState<{ firebaseTemplate: Option }>({
    firebaseTemplate: { label: "Choose One", value: null },
  });

  const getFirebaseTemplateIds = async () => {
    const request = await FirebaseTemplateService.getFirebaseTemplates({
      metaData: { fields: ["appFirebaseTemplateId", "name"] },
    });
    if ("data" in request) {
      const options = request.data.firebaseTemplates?.map((template) => {
        return { label: template.name, value: template.appFirebaseTemplateId };
      });
      setFirebaseTemplateIdOptions(options);
    }
  };

  useEffect(() => {
    getFirebaseTemplateIds();
  }, []);

  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="w-100">
        {services && services.includes("firebase") && (
          <>
            <div className="fv-row mb-10">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">Firebase Template ID</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify your unique app name"
                ></i>
              </label>
              <Select
                options={firebaseTemplateIdOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  formik.setFieldValue(
                    "platforms.pushNotification.firebase.appFirebaseTemplateId",
                    options?.value
                  );
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      firebaseTemplate: {
                        label: options?.label || "",
                        value: options?.value,
                      },
                    };
                  });
                }}
                value={selectState.firebaseTemplate}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
