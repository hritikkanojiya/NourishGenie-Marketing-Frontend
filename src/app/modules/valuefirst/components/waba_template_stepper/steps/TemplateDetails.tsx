import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Option } from "../../../../../common/globals/common.model";
import clsx from "clsx";
import { StepProps } from "../../../../campaigns/models/campaign.model";
import { WABASenderService } from "../../../../waba/services/waba_sender.service";

type SelectState = {
  senderId: Option;
  category: Option;
  requestType: Option;
};

const TemplateDetailsStep: FC<StepProps> = ({
  formik,
  isReadOnly,
  wabaTemplateDetails,
  editMode,
}) => {
  const [wabaSenders, setWabaSenders] = useState<Option[]>([]);
  const [selectState, setSelectState] = useState<SelectState>({
    category: { label: "Choose One", value: null },
    senderId: {
      label: "Choose One",
      value: null,
    },
    requestType: {
      label: "Choose One",
      value: null,
    },
  });

  const getWabaSenderIds = async () => {
    const request = await WABASenderService.getSenders({
      metaData: { fields: ["name", "appWABASenderId"], limit: -1 },
    });
    if ("data" in request) {
      const senderIds = request.data.WABASenders?.map((sender) => {
        return { label: sender.name, value: sender.appWABASenderId };
      });
      setWabaSenders(senderIds);
    }
  };

  const categoryOptions: Option[] = [
    { label: "MARKETING", value: "MARKETING" },
    { label: "UTILITY", value: "UTILITY" },
    { label: "AUTHENTICATION", value: "AUTHENTICATION" },
  ];

  const requestTypeOptions: Option[] = [
    { label: "FRESH", value: "FRESH" },
    { label: "EXISTING", value: "EXISTING" },
  ];

  useEffect(() => {
    getWabaSenderIds();
  }, []);

  useEffect(() => {
    if (isReadOnly || editMode) {
      if (
        wabaTemplateDetails &&
        "appWABAValueFirstTemplateId" in wabaTemplateDetails
      ) {
        formik.setFieldValue("name", wabaTemplateDetails.name);
        formik.setFieldValue("description", wabaTemplateDetails.description);
        formik.setFieldValue(
          "appWABASenderId",
          wabaTemplateDetails.appWABASender.appWABASenderId
        );
        formik.setFieldValue("requestType", wabaTemplateDetails.requestType);
        formik.setFieldValue("category", wabaTemplateDetails.category);
        formik.setFieldValue("category", wabaTemplateDetails);
        formik.setFieldValue("type", wabaTemplateDetails.type);
        formik.setFieldValue("components", wabaTemplateDetails.components);
        const category = categoryOptions.find(
          (cat) => cat.value === wabaTemplateDetails.category
        );
        const requestType = requestTypeOptions.find(
          (type) => type.value === wabaTemplateDetails.requestType
        );
        const sender = wabaSenders.find(
          (wabaSender) =>
            wabaSender.value ===
            wabaTemplateDetails.appWABASender.appWABASenderId
        );
        setSelectState({
          category: { label: category?.label || "", value: category?.value },
          requestType: {
            label: requestType?.label || "",
            value: requestType?.value,
          },
          senderId: { label: sender?.label || "", value: sender?.value },
        });
      }
    }
  }, []);

  return (
    <div className="current" data-kt-stepper-element="content">
      <div className="container-fluid">
        <div className="fv-row row mb-5">
          <div className="col-6">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className="required">Name</span>
              <i
                className="fas fa-exclamation-circle ms-2 fs-7"
                data-bs-toggle="tooltip"
                title="Specify your unique template name"
              ></i>
            </label>
            <input
              disabled={isReadOnly || editMode}
              {...formik.getFieldProps("name")}
              type="text"
              className={clsx("form-control bg-transparent py-2")}
              placeholder="Enter Name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="col-6">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className="required">Category</span>
              <i
                className="fas fa-exclamation-circle ms-2 fs-7"
                data-bs-toggle="tooltip"
                title="Specify the category for this particular template"
              ></i>
            </label>
            <Select
              isDisabled={isReadOnly || editMode}
              options={categoryOptions}
              menuPosition="fixed"
              isMulti={false}
              onChange={(option) => {
                formik.setFieldValue("category", option?.value);
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    category: {
                      label: option?.label || "",
                      value: option?.value,
                    },
                  };
                });
              }}
              value={selectState.category}
            />
            {formik.touched.category && formik.errors.category && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.category}</span>
              </div>
            )}
          </div>
        </div>
        {!(isReadOnly || editMode) && (
          <>
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">WhatsApp Sender</span>
                <i
                  className="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify the Sender Id for this particular template"
                ></i>
              </label>
              <Select
                isDisabled={isReadOnly || editMode}
                options={wabaSenders}
                menuPosition="fixed"
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue("appWABASenderId", option?.value);
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      senderId: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.senderId}
              />
              {formik.touched.appWABASenderId && formik.errors.appWABASenderId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.appWABASenderId}</span>
                </div>
              )}
            </div>
            <div className="fv-row row mb-5">
              <div className="col-6">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span className="required">Request Type</span>
                  <i
                    className="fas fa-exclamation-circle ms-2 fs-7"
                    data-bs-toggle="tooltip"
                    title="Specify the request type for this particular template"
                  ></i>
                </label>
                <Select
                  isDisabled={isReadOnly || editMode}
                  options={requestTypeOptions}
                  menuPosition="fixed"
                  isMulti={false}
                  onChange={(option) => {
                    formik.setFieldValue("requestType", option?.value);
                    setSelectState((prevState) => {
                      return {
                        ...prevState,
                        requestType: {
                          label: option?.label || "",
                          value: option?.value,
                        },
                      };
                    });
                  }}
                  value={selectState.requestType}
                />
                {formik.touched.appWABASenderId &&
                  formik.errors.appWABASenderId && (
                    <div className="fv-plugins-message-container text-danger">
                      <span role="alert">{formik.errors.appWABASenderId}</span>
                    </div>
                  )}
              </div>
              <div className="col-6">
                <label className="form-label fs-6 fw-bolder text-dark">
                  Allow Category Change
                </label>
                <div className="fv-row row">
                  <div className="col-6">
                    <div data-kt-buttons="true">
                      <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success px-2 w-100">
                        <div className="d-flex align-items-center justify-content-evenly">
                          <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                            <input
                              disabled={isReadOnly || editMode}
                              className="form-check-input w-15px h-15px"
                              type="radio"
                              {...formik.getFieldProps("allow_category_change")}
                              value={"true"}
                              checked={
                                formik.values.allow_category_change === "true"
                              }
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
                              disabled={isReadOnly || editMode}
                              className="form-check-input w-15px h-15px"
                              type="radio"
                              {...formik.getFieldProps("allow_category_change")}
                              value={"false"}
                              checked={
                                formik.values.allow_category_change === "false"
                              }
                            />
                          </div>
                          <div className="fw-bold">No</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {formik.touched.secure && formik.errors.secure && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.secure}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        <div className="fv-row">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">Description</span>
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Describe your template"
            ></i>
          </label>
          <textarea
            disabled={isReadOnly || editMode}
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
      </div>
    </div>
  );
};

export { TemplateDetailsStep };
