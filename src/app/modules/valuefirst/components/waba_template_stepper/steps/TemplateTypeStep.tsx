// eslint-disable-next-line
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Option } from "../../../../../common/globals/common.model";
import { StepProps } from "../../../../campaigns/models/campaign.model";
import { AppParameterService } from "../../../../parameter/services/app_parameter.service";
import { SearchParameterPayload } from "../../../../parameter/models/app_parameter.model";
import clsx from "clsx";
import { showToast } from "../../../../../common/toastify/toastify.config";
import { findSubstringIndices } from "../../../../../common/globals/common.constants";

type SelectState = {
  type: Option;
  headerType: Option;
};

const TemplateTypeSteps: FC<StepProps> = ({
  formik,
  setValidForm,
  wabaTemplateDetails,
  isReadOnly,
  editMode,
}) => {
  const [selectState, setSelectState] = useState<SelectState>({
    type: {
      label: formik.values.type || "",
      value: formik.values.type || null,
    },
    headerType: { label: "TEXT", value: "TEXT" },
  });

  const [buttonTypeOptions] = useState<Option[]>([
    { label: "QUICK REPLY", value: "QUICK_REPLY" },
    { label: "URL", value: "URL" },
    { label: "PHONE NUMBER", value: "PHONE_NUMBER" },
  ]);

  const [buttonSelectState, setButtonSelectState] = useState<Option>({
    label: "QUICK REPLY",
    value: "QUICK_REPLY",
  });

  const [componentTypes, setComponentTypes] = useState<string[]>([]);
  const [validPayload, setValidPayload] = useState({
    body: false,
    header: false,
    footer: false,
    button: false,
  });

  const typeOptions: Option[] = [
    { label: "STANDARD", value: "STANDARD" },
    { label: "MEDIA", value: "MEDIA" },
  ];

  let timeout: ReturnType<typeof setTimeout>;

  const checkBodyParameters = () => {
    let value: string = formik.values?.components?.[0]?.metaData?.text;
    const valuesFirstRegexPattern = new RegExp(/\.\*/g);
    const parameterRegex = new RegExp(
      /\s*{{\s*(?:MARKETING|CONTACT|params)\.\s*([^}\s]*)\s*}}\s*|##([^#]*)##\s*/,
      "gm"
    );
    if (parameterRegex.test(value)) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => getParameters(value, "BODY"), 1000);
    } else if (valuesFirstRegexPattern.test(value)) {
      const matches = findSubstringIndices(value, ".*");
      value = value.replaceAll(".*", "{{  }}");
      formik.setFieldValue("components.[0].metaData.text", value);
      const plural = matches?.length > 1 ? "s" : "";
      showToast(
        `There ${plural === "s" ? "are" : "is"}  ${
          matches?.length
        } parameter${plural} present in your template body, please provide corresponding value${plural} for ${
          plural === "s" ? "those" : "that"
        } parameter${[plural]}.`,
        "info"
      );
    } else {
      showToast("Your template does not contain any parameter.", "warning");
    }
  };

  const checkButtonURLParameters = () => {
    const index = formik.values.components?.findIndex(
      (component: any) => component.componentType === "BUTTONS"
    );
    if (index !== -1) {
      let value: string =
        formik.values?.components?.[index]?.metaData?.url.value;
      const valuesFirstRegexPattern = new RegExp(/\.\*/g);
      const parameterRegex = new RegExp(
        /\s*{{\s*(?:MARKETING|CONTACT|params)\.\s*([^}\s]*)\s*}}\s*|##([^#]*)##\s*/,
        "gm"
      );
      if (parameterRegex.test(value)) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => getParameters(value, "BUTTONS"), 1000);
      } else if (valuesFirstRegexPattern.test(value)) {
        const matches = findSubstringIndices(value, ".*");
        value = value.replaceAll(".*", "{{  }}");
        formik.setFieldValue("components.[0].metaData.text", value);
        const plural = matches?.length > 1 ? "s" : "";
        showToast(
          `There ${plural === "s" ? "are" : "is"}  ${
            matches?.length
          } parameter${plural} present in your template button's url, please provide corresponding value${plural} for ${
            plural === "s" ? "those" : "that"
          } parameter${[plural]}.`,
          "info"
        );
      } else {
        showToast("Your template does not contain any parameter.", "warning");
      }
    }
  };

  const checkHeaderParameters = () => {
    const index = formik.values.components?.findIndex(
      (component: any) => component.componentType === "HEADER"
    );
    if (index !== -1) {
      let value = formik.values?.components?.[index]?.metaData?.text;
      const valuesFirstRegexPattern = new RegExp(/\.\*/g);
      const parameterRegex = new RegExp(
        /\s*{{\s*(?:MARKETING|CONTACT|params)\.\s*([^}\s]*)\s*}}\s*|##([^#]*)##\s*/,
        "gm"
      );
      if (parameterRegex.test(value)) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => getParameters(value, "HEADER"), 1000);
      } else if (valuesFirstRegexPattern.test(value)) {
        const matches = findSubstringIndices(value, ".*");
        value = value.replaceAll(".*", "{{  }}");
        formik.setFieldValue("components.[1].metaData.text", value);
        // const matches = value?.match(valuesFirstRegexPattern);
        // const indexes = matches?.map((sub: string) => {
        //   return {
        //     start: value.indexOf(sub),
        //     end: value.indexOf(sub) + sub.length - 1,
        //   };
        // });
        // console.log(indexes);
        const plural = matches?.length > 1 ? "s" : "";
        showToast(
          `There ${plural === "s" ? "are" : "is"} ${
            matches?.length
          } parameter${plural} present in your template header, please provide corresponding value${plural} for ${
            plural === "s" ? "those" : "that"
          } parameter${[plural]}.`,
          "info"
        );
      } else {
        showToast("Your template does not contain any parameter.", "warning");
      }
    }
  };

  const getParameters = async (
    value: string,
    componentType: "BODY" | "HEADER" | "BUTTONS"
  ) => {
    const index = formik.values.components.findIndex(
      (component: any) => component.componentType === componentType
    );
    if (index !== -1) {
      const payload: SearchParameterPayload = {
        rawString: value,
        appContactId: null,
        replaceParameters: false,
      };
      const request = await AppParameterService.searchParameters(payload);
      if ("data" in request && "appParameters" in request.data) {
        if (request.data.appParameters?.length > 0) {
          if (componentType === "BODY" || componentType === "HEADER") {
            formik.setFieldValue(
              `components[${index}].metaData.hasParameters`,
              true
            );
          }
          let examples = request.data.appParameters?.map(
            (param) => param.replaceWith
          );
          examples = Array.from(new Set(examples));
          switch (componentType) {
            case "BODY":
              formik.setFieldValue("components[0].metaData.example.body_text", [
                examples,
              ]);
              setValidPayload((prevState) => {
                return { ...prevState, body: true };
              });
              break;
            case "HEADER":
              formik.setFieldValue(
                `components[${index}].metaData.example.header_text`,
                examples
              );
              setValidPayload((prevState) => {
                return { ...prevState, header: true };
              });
              break;
            case "BUTTONS":
              formik.setFieldValue(
                `components[${index}].metaData.url.example`,
                examples
              );
              formik.setFieldValue(
                `components[${index}].metaData.url.hasParameters`,
                true
              );
              setValidPayload((prevState) => {
                return { ...prevState, button: true };
              });
              break;
            default:
              showToast("Invalid component type.", "error");
              break;
          }
          showToast(
            "Your parameters are correct, you can proceed with creating the template",
            "success"
          );
        }
      }
    }
  };

  const handleComponents = (id: string) => {
    if (!componentTypes.includes(id)) {
      setComponentTypes((prevstate) => [...prevstate, id]);
      const component: any = {
        componentType: id.toUpperCase(),
        metaData: {
          format: "TEXT",
          text: "",
        },
      };
      if (id.toUpperCase() !== "FOOTER" && id.toUpperCase() === "HEADER") {
        component.metaData.hasParameters = false;
      }
      if (id.toUpperCase() === "BUTTONS") {
        component.metaData.buttonType = "QUICK_REPLY";
      }
      const length = formik.values.components?.length;
      formik.setFieldValue(`components[${length}]`, component);
    } else {
      setComponentTypes((prevState) => prevState.filter((type) => type !== id));
      const components = formik.values.components.filter(
        (component: any) => component?.componentType !== id.toUpperCase()
      );
      formik.setFieldValue(`components`, components);
    }
  };

  const handleComponentTypeChange = (event: any) => {
    const id = event.target.id;
    switch (id) {
      case "header":
        handleComponents(id);
        break;
      case "footer":
        handleComponents(id);
        break;
      case "buttons":
        handleComponents(id);
        break;
      default:
        showToast("Invalid component type selected!!!", "warning");
        return;
    }
  };

  const handleButtonUrlChange = (event: any) => {
    const url = event.target.value;
    formik.setFieldValue(
      `components[${formik.values.components.findIndex(
        (component: any) => component.componentType === "BUTTONS"
      )}].metaData.url.value`,
      url
    );
  };

  const handleButtonPhoneChange = (event: any) => {
    const phoneNumber = event.target.value;
    formik.setFieldValue(
      `components[${formik.values.components.findIndex(
        (component: any) => component.componentType === "BUTTONS"
      )}].metaData.phone_number`,
      phoneNumber
    );
  };

  const handleButtonTextChange = (event: any) => {
    const text = event.target.value;
    formik.setFieldValue(
      `components[${formik.values.components.findIndex(
        (component: any) => component.componentType === "BUTTONS"
      )}].metaData.text`,
      text
    );
  };

  useEffect(() => {
    if (setValidForm) {
      // if (formik.values.type === "STANDARD" && validPayload.body) {
      //   setValidForm(true);
      // } else if (formik.values.type === "MEDIA") {
      //   if (
      //     !componentTypes.includes("header") &&
      //     componentTypes.includes("footer")
      //   ) {
      //     if (validPayload.body) {
      //       setValidForm(true);
      //     }
      //   } else if (componentTypes.includes("header")) {
      //     if (validPayload.body && validPayload.header) {
      //       setValidForm(true);
      //     }
      //   } else if (componentTypes.includes("buttons")) {
      //     if (validPayload.body && validPayload.button) {
      //       setValidForm(true);
      //     }
      //   }
      // }
      setValidForm(true);
    }
  }, [
    validPayload.body,
    validPayload.header,
    validPayload.footer,
    validPayload.button,
  ]);

  useEffect(() => {
    if (
      wabaTemplateDetails &&
      "appWABAValueFirstTemplateId" in wabaTemplateDetails
    ) {
      setSelectState((prevState) => {
        return {
          ...prevState,
          type: {
            label: wabaTemplateDetails.type,
            value: wabaTemplateDetails.type,
          },
        };
      });
      const componentTypesArr = wabaTemplateDetails.components.map(
        (component) => component.componentType.toLowerCase()
      );
      if (componentTypesArr.includes("buttons")) {
        wabaTemplateDetails.components.map((component) => {
          if (
            component.componentType === "BUTTONS" &&
            component.metaData.buttonType !== undefined
          ) {
            const buttonType = component.metaData.buttonType;
            setButtonSelectState({ label: buttonType, value: buttonType });
          }
          return component.componentType.toLowerCase();
        });
      }
      setComponentTypes(componentTypesArr);
    }
  }, []);

  return (
    <div className="current" data-kt-stepper-element="content">
      <div className="container-fluid">
        <div className="fv-row mb-5">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">Type</span>
          </label>
          <Select
            isDisabled={isReadOnly}
            options={typeOptions}
            menuPosition="fixed"
            isMulti={false}
            onChange={(option) => {
              formik.setFieldValue("type", option?.value);
              setSelectState((prevState) => {
                return {
                  ...prevState,
                  type: { label: option?.label || "", value: option?.value },
                };
              });
              if (option?.value === "STANDARD") {
                const components = [
                  {
                    componentType: "BODY",
                    metaData: {
                      format: "TEXT",
                      hasParameters: false,
                      text: "",
                      example: {},
                    },
                  },
                ];
                formik.setFieldValue("components", components);
              }
            }}
            value={selectState.type}
          />
          {formik.touched.type && formik.errors.type && (
            <div className="fv-plugins-message-container text-danger">
              <span role="alert">{formik.errors.type}</span>
            </div>
          )}
        </div>
        {formik.values.type === "MEDIA" && (
          <>
            <div className="fv-row row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className="required">Components</span>
              </label>
              <div className="col-md-3 text-center">
                <button
                  disabled={isReadOnly || editMode}
                  type="button"
                  onClick={(event) => handleComponentTypeChange(event)}
                  id="header"
                  className={clsx(
                    "btn btn-outline btn-outline-dashed btn-outline-primary",
                    {
                      "btn-outline-success": componentTypes.includes("header"),
                    }
                  )}
                >
                  {componentTypes.includes("header") && (
                    <i className="fa fa-check px-2"></i>
                  )}
                  Header
                </button>
              </div>
              <div className="col-md-3 text-center">
                <button
                  disabled={isReadOnly || editMode}
                  type="button"
                  id="body"
                  className={clsx(
                    "btn btn-outline btn-outline-dashed btn-outline-success"
                  )}
                >
                  <i className="fa fa-check px-2"></i>Body
                </button>
              </div>
              <div id="footer" className="col-md-3 text-center">
                <button
                  disabled={isReadOnly || editMode}
                  type="button"
                  onClick={(event) => handleComponentTypeChange(event)}
                  id="footer"
                  className={clsx(
                    "btn btn-outline btn-outline-dashed btn-outline-primary",
                    {
                      "btn-outline-success": componentTypes.includes("footer"),
                    }
                  )}
                >
                  {componentTypes.includes("footer") && (
                    <i className="fa fa-check px-2"></i>
                  )}
                  Footer
                </button>
              </div>
              <div id="buttons" className="col-md-3 text-center">
                <button
                  disabled={isReadOnly || editMode}
                  type="button"
                  onClick={(event) => handleComponentTypeChange(event)}
                  id="buttons"
                  className={clsx(
                    "btn btn-outline btn-outline-dashed btn-outline-primary",
                    {
                      "btn-outline-success": componentTypes.includes("buttons"),
                    }
                  )}
                >
                  {componentTypes.includes("buttons") && (
                    <i className="fa fa-check px-2"></i>
                  )}
                  Buttons
                </button>
              </div>
            </div>
            {componentTypes.includes("header") && (
              <>
                <div className="fv-row mt-5">
                  <label className="form-label fs-6 fw-bolder text-dark">
                    <span
                      className={clsx({
                        required: componentTypes.includes("header"),
                      })}
                    >
                      Header
                    </span>
                  </label>
                  <textarea
                    disabled={isReadOnly}
                    maxLength={60}
                    className="form-control bg-transparent"
                    rows={3}
                    {...formik.getFieldProps(
                      `components[${formik.values.components.findIndex(
                        (component: any) => component.componentType === "HEADER"
                      )}].metaData.text`
                    )}
                    placeholder="Header"
                  ></textarea>
                  <span
                    className={clsx(
                      "badge badge-sm mb-1 badge-light-success float-end fw-bolder position-absolute"
                    )}
                  >
                    {
                      formik.values.components[
                        formik.values.components.findIndex(
                          (component: any) =>
                            component.componentType === "HEADER"
                        )
                      ].metaData?.text?.length
                    }
                    /60
                  </span>
                  <button
                    disabled={isReadOnly}
                    type="button"
                    className="btn btn-primary mt-5"
                    onClick={checkHeaderParameters}
                  >
                    Check Parameters
                  </button>
                </div>
              </>
            )}
          </>
        )}
        <div className="position-relative">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className={"required"}>Body</span>
          </label>
          <textarea
            disabled={isReadOnly}
            maxLength={1024}
            className="form-control bg-transparent"
            rows={8}
            {...formik.getFieldProps(
              `components[${formik.values.components.findIndex(
                (component: any) => component.componentType === "BODY"
              )}].metaData.text`
            )}
            placeholder="Body"
          ></textarea>
          <span
            className={clsx(
              "badge badge-sm mb-1 badge-light-success float-end fw-bolder position-absolute position-absolute"
            )}
            style={{ right: 0 }}
          >
            {
              formik.values.components[
                formik.values.components.findIndex(
                  (component: any) => component.componentType === "BODY"
                )
              ].metaData.text.length
            }
            /1024
          </span>
          <div>
            <button
              disabled={isReadOnly}
              type="button"
              className="btn btn-primary mt-5"
              onClick={checkBodyParameters}
            >
              Check Parameters
            </button>
          </div>
        </div>
        {formik.values.type === "MEDIA" && (
          <>
            {componentTypes.includes("footer") && (
              <div className="fv-row mt-5">
                <label className="form-label fs-6 fw-bolder text-dark">
                  <span
                    className={clsx({
                      required: componentTypes.includes("footer"),
                    })}
                  >
                    Footer
                  </span>
                </label>
                <textarea
                  disabled={isReadOnly}
                  maxLength={60}
                  className="form-control bg-transparent"
                  rows={3}
                  {...formik.getFieldProps(
                    `components[${formik.values.components.findIndex(
                      (component: any) => component.componentType === "FOOTER"
                    )}].metaData.text`
                  )}
                  placeholder="Footer"
                ></textarea>
                <span
                  className={clsx(
                    "badge badge-sm mb-1 badge-light-success float-end fw-bolder position-absolute"
                  )}
                  style={{ right: 0 }}
                >
                  {
                    formik.values.components[
                      formik.values.components.findIndex(
                        (component: any) => component.componentType === "FOOTER"
                      )
                    ].metaData?.text?.length
                  }
                  /60
                </span>
              </div>
            )}
          </>
        )}
        {formik.values.type === "MEDIA" && (
          <>
            {componentTypes.includes("buttons") && (
              <>
                <div className="fv-row mt-5">
                  <label className="form-label fs-6 fw-bolder text-dark">
                    <span
                      className={clsx({
                        required: componentTypes.includes("buttons"),
                      })}
                    >
                      Buttons
                    </span>
                  </label>
                  <textarea
                    disabled={isReadOnly}
                    maxLength={25}
                    className="form-control bg-transparent"
                    rows={3}
                    {...formik.getFieldProps(
                      `components[${formik.values.components.findIndex(
                        (component: any) =>
                          component.componentType === "BUTTONS"
                      )}].metaData.text`
                    )}
                    placeholder="Button Text"
                    onChange={handleButtonTextChange}
                  ></textarea>
                  <span
                    className={clsx(
                      "badge badge-sm mb-1 badge-light-success float-end fw-bolder position-absolute"
                    )}
                  >
                    {
                      formik.values.components[
                        formik.values.components.findIndex(
                          (component: any) =>
                            component.componentType === "BUTTONS"
                        )
                      ].metaData?.text?.length
                    }
                    /25
                  </span>
                  {buttonSelectState.value === "URL" && (
                    <>
                      <input
                        disabled={isReadOnly}
                        className="form-control bg-transparent mb-2"
                        placeholder="Enter the URL"
                        type="url"
                        onChange={handleButtonUrlChange}
                      />
                      <button
                        disabled={isReadOnly}
                        type="button"
                        className="btn btn-primary mb-2"
                        onClick={checkButtonURLParameters}
                      >
                        Check Parameters
                      </button>
                    </>
                  )}
                  {buttonSelectState.value === "PHONE_NUMBER" && (
                    <input
                      disabled={isReadOnly}
                      className="form-control bg-transparent mb-2"
                      placeholder="Enter the phone number"
                      type="number"
                      onChange={handleButtonPhoneChange}
                    />
                  )}
                </div>
                <Select
                  placeholder="Button Type"
                  menuPosition="fixed"
                  isMulti={false}
                  options={buttonTypeOptions}
                  value={buttonSelectState}
                  onChange={(option) => {
                    setButtonSelectState({
                      label: option?.label || "",
                      value: option?.value,
                    });
                    formik.setFieldValue(
                      `components[${formik.values.components.findIndex(
                        (component: any) =>
                          component.componentType === "BUTTONS"
                      )}].metaData.buttonType`,
                      option?.value
                    );
                    if (option?.value === "URL") {
                      formik.setFieldValue(
                        `components[${formik.values.components.findIndex(
                          (component: any) =>
                            component.componentType === "BUTTONS"
                        )}].metaData.url`,
                        {
                          value: "",
                          hasParameters: false,
                          example: [],
                        }
                      );
                    } else if (option?.value === "PHONE_NUMBER") {
                      delete formik.values.components[
                        formik.values.components.findIndex(
                          (component: any) =>
                            component.componentType === "BUTTONS"
                        )
                      ].metaData.url;
                    } else if (option?.value === "QUICK_REPLY") {
                      delete formik.values.components[
                        formik.values.components.findIndex(
                          (component: any) =>
                            component.componentType === "BUTTONS"
                        )
                      ].metaData.url;
                      delete formik.values.components[
                        formik.values.components.findIndex(
                          (component: any) =>
                            component.componentType === "BUTTONS"
                        )
                      ].metaData.phone_number;
                    }
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export { TemplateTypeSteps };
