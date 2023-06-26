import { FC } from "react";
import { StepProps } from "../../../models/campaign.model";
import Select from "react-select";

const PlatformDetails: FC<StepProps> = ({
  formik,
  hasError,
  platforms,
  setPlatforms,
  setService,
  services,
}) => {
  const emailOptions = [{ label: "Send In Blue", value: "sendInBlue" }];

  const whatsappOptions: any = [{ label: "Value First", value: "ValueFirst" }];

  const smsOptions = [{ label: "MSG91", value: "msg91" }];

  const notificationOptions = [{ label: "Firebase", value: "firebase" }];

  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="w-100">
        <div className="fv-row">
          {/* begin::Label */}
          <label className="d-flex align-items-center fs-5 fw-semibold mb-4">
            <span className="required">Platforms</span>
          </label>
          <div className="d-flex justify-content-end">
            <div className="form-check form-check-custom form-check-solid form-check-success pe-1 form-switch">
              <div
                className="
                form-check form-check-custom form-check-solid form-check-success pe-1 form-switch
                  "
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={"email"}
                  onChange={(e) => {
                    let selected: any = platforms;
                    if (e.target.checked) {
                      selected = [...selected, e.target.value];
                    } else {
                      selected = selected.filter(
                        (value: any) => value !== e.target.value
                      );
                    }
                    setPlatforms(selected);
                  }}
                />
                <label
                  className="form-check-label text-gray-700 fw-bold"
                  htmlFor="kt_builder_sidebar_minimize_desktop_enabled"
                  data-bs-toggle="tooltip"
                  data-kt-initialized="1"
                >
                  Email
                </label>
              </div>
              <div
                className="
                form-check form-check-custom form-check-solid form-check-success pe-1 form-switch ms-10
                  "
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="kt_builder_sidebar_minimize_desktop_hoverable"
                  value={"whatsapp"}
                  onChange={(e) => {
                    let selected: any = platforms;
                    if (e.target.checked) {
                      selected = [...selected, e.target.value];
                    } else {
                      selected = selected.filter(
                        (value: any) => value !== e.target.value
                      );
                    }
                    setPlatforms(selected);
                  }}
                />
                <label
                  className="form-check-label text-gray-700 fw-bold"
                  htmlFor="kt_builder_sidebar_minimize_desktop_hoverable"
                  data-bs-toggle="tooltip"
                  data-kt-initialized="1"
                >
                  WhatsApp
                </label>
              </div>
              <div
                className="
                form-check form-check-custom form-check-solid form-check-success pe-1 form-switch ms-10
                  "
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="kt_builder_sidebar_minimize_desktop_default"
                  value={"sms"}
                  onChange={(e) => {
                    let selected: any = platforms;
                    if (e.target.checked) {
                      selected = [...selected, e.target.value];
                    } else {
                      selected = selected.filter(
                        (value: any) => value !== e.target.value
                      );
                    }
                    setPlatforms(selected);
                  }}
                />
                <label
                  className="form-check-label text-gray-700 fw-bold"
                  htmlFor="kt_builder_sidebar_minimize_desktop_default"
                  data-bs-toggle="tooltip"
                  data-kt-initialized="1"
                >
                  SMS
                </label>
              </div>
              <div
                className="
                form-check form-check-custom form-check-solid form-check-success pe-1 form-switch ms-10
                  "
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="kt_builder_sidebar_minimize_desktop_default"
                  value={"pushNotification"}
                  onChange={(e) => {
                    let selected: any = platforms;
                    if (e.target.checked) {
                      selected = [...selected, e.target.value];
                    } else {
                      selected = selected.filter(
                        (value: any) => value !== e.target.value
                      );
                    }
                    setPlatforms(selected);
                  }}
                />
                <label
                  className="form-check-label text-gray-700 fw-bold"
                  htmlFor="kt_builder_sidebar_minimize_desktop_default"
                  data-bs-toggle="tooltip"
                  data-kt-initialized="1"
                >
                  Push Notification
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-start m-5">
            {platforms?.includes("email") && (
              <Select
                options={emailOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  services && services?.length > 0
                    ? setService([...services, options?.value])
                    : setService([options?.value]);
                }}
              />
            )}

            {platforms?.includes("whatsapp") && (
              <Select
                options={whatsappOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options: any) => {
                  services && services?.length > 0
                    ? setService([...services, options?.value])
                    : setService([options?.value]);
                }}
              />
            )}

            {platforms?.includes("sms") && (
              <Select
                options={smsOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  services && services?.length > 0
                    ? setService([...services, options?.value])
                    : setService([options?.value]);
                }}
              />
            )}

            {platforms?.includes("pushNotification") && (
              <Select
                options={notificationOptions}
                menuPosition="fixed"
                isMulti={false}
                onChange={(options) => {
                  services && services?.length > 0
                    ? setService([...services, options?.value])
                    : setService([options?.value]);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PlatformDetails };
