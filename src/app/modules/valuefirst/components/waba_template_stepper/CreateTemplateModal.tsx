/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { StepperComponent } from "../../../../../_metronic/assets/ts/components";
import { KTSVG } from "../../../../../_metronic/helpers";
import { useFormik } from "formik";
import {
  UpdateWABATemplateComponentPayload,
  WABATemplate,
  WABATemplatePayload,
} from "../../models/wabaTemplate.model";
import { TemplateDetailsStep } from "./steps/TemplateDetails";
import { showToast } from "../../../../common/toastify/toastify.config";
import { TemplateTypeSteps } from "./steps/TemplateTypeStep";
import { WabaTemplateService } from "../../services/wabaTemplate.service";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../../common/globals/common.constants";

type Props = {
  show: boolean;
  handleClose: () => void;
  WABATemplate: WABATemplate | {};
  isReadOnly: boolean;
  editMode: boolean;
};

let initialValues: WABATemplatePayload = {
  name: "",
  description: "",
  allow_category_change: true.toString(),
  appWABASenderId: "",
  requestType: "",
  category: "",
  isValidated: true,
  origin: "MANUAL",
  language: {
    policy: "deterministic",
    code: "en",
  },
  type: "STANDARD",
  components: [
    {
      componentType: "BODY",
      metaData: {
        format: "TEXT",
        hasParameters: false,
        text: "",
      },
    },
  ],
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateWABATemplateModal = ({
  show,
  handleClose,
  WABATemplate,
  isReadOnly,
  editMode,
}: Props) => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const stepper = useRef<StepperComponent | null>(null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validForm, setValidForm] = useState(false);

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(
      stepperRef.current as HTMLDivElement
    );
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      if (!editMode) {
        const request = await WabaTemplateService.createTemplate(values);
        if ("data" in request && "valueFirstTemplateDetails" in request.data) {
          showToast(request.data.message, "success");
          handleClose();
        }
        setLoading(false);
      } else {
        if (editMode) {
          if (WABATemplate && "appWABAValueFirstTemplateId" in WABATemplate) {
            const payload: UpdateWABATemplateComponentPayload = {
              appWABAValueFirstTemplateId:
                WABATemplate.appWABAValueFirstTemplateId,
              components: formik.values.components.map((component: any) => {
                if (Object.keys(component.metaData).includes("payloadText")) {
                  delete component.metaData.payloadText;
                }
                return component;
              }),
            };
            const request =
              await WabaTemplateService.updateWABATemplateComponents(payload);
            if ("data" in request && "message" in request.data) {
              showToast(request.data.message, "success");
              handleClose();
            }
          }
        }
      }
    },
  });

  const prevStep = () => {
    if (!stepper.current) {
      return;
    }

    stepper.current.goPrev();
  };

  const nextStep = () => {
    setHasError(false);
    if (!stepper.current) {
      return;
    }

    const nextStep = stepper.current.getNextStepIndex();

    switch (nextStep) {
      case 2:
        if (!(isReadOnly || editMode)) {
          if (
            !formik.values.name ||
            !formik.values.description ||
            !formik.values.appWABASenderId ||
            !formik.values.category ||
            !formik.values.allow_category_change ||
            !formik.values.requestType
          ) {
            showToast(
              "Please fill out the required fields before proceeding",
              "warning"
            );
            return;
          }
        }
        break;

      default:
        break;
    }

    stepper.current.goNext();
  };

  useEffect(() => {
    if (!show) {
      formik.resetForm();
    }
    if (show && WABATemplate) {
      if (editMode || isReadOnly) {
        if ("appWABAValueFirstTemplateId" in WABATemplate) {
          initialValues = {
            allow_category_change: true,
            appWABASenderId: WABATemplate.appWABASender.appWABASenderId,
            category: WABATemplate.category,
            components: WABATemplate.components,
            description: WABATemplate.description,
            isValidated: WABATemplate.isValidated,
            language: WABATemplate.language,
            name: WABATemplate.name,
            origin: WABATemplate.origin,
            requestType: WABATemplate.requestType,
            type: WABATemplate.type,
          };
        }
      }
    }
  }, [show]);

  return createPortal(
    <>
      {show && (
        <Helmet>
          <title>{APP_NAME} | WhatsApp Templates | Create Template</title>
        </Helmet>
      )}
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered"
        show={show}
        onHide={handleClose}
        onEntered={loadStepper}
        backdrop={"static"}
        size="lg"
      >
        <div className="modal-header">
          <h2>{!isReadOnly && "Create"} WhatsApp Template</h2>
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={handleClose}
          >
            <KTSVG
              className="svg-icon-1"
              path="/media/icons/duotune/arrows/arr061.svg"
            />
          </div>
        </div>

        <div className="modal-body py-lg-10 px-lg-10">
          <div
            ref={stepperRef}
            className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
            id="kt_modal_create_app_stepper"
          >
            <div className="flex-row-fluid">
              <form
                noValidate
                id="kt_modal_create_app_form"
                onSubmit={formik.handleSubmit}
              >
                <TemplateDetailsStep
                  formik={formik}
                  hasError={hasError}
                  setValidForm={setValidForm}
                  isReadOnly={isReadOnly}
                  wabaTemplateDetails={WABATemplate}
                  editMode={editMode}
                />
                <TemplateTypeSteps
                  formik={formik}
                  hasError={hasError}
                  setValidForm={setValidForm}
                  isReadOnly={isReadOnly}
                  wabaTemplateDetails={WABATemplate}
                  editMode={editMode}
                />
                <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10">
                  <button
                    type="button"
                    className="btn btn-lg btn-light-primary"
                    data-kt-stepper-action="previous"
                    onClick={prevStep}
                    disabled={loading}
                  >
                    <KTSVG
                      path="/media/icons/duotune/arrows/arr063.svg"
                      className="svg-icon-3 me-1"
                    />{" "}
                    Previous
                  </button>
                  {!isReadOnly && (
                    <button
                      disabled={loading || !validForm}
                      type="submit"
                      className="btn btn-lg btn-primary"
                      data-kt-stepper-action="submit"
                    >
                      Submit{" "}
                      <KTSVG
                        path="/media/icons/duotune/arrows/arr064.svg"
                        className="svg-icon-3 ms-2 me-0"
                      />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-lg btn-primary"
                    data-kt-stepper-action="next"
                    onClick={nextStep}
                    disabled={loading}
                  >
                    Next Step{" "}
                    <KTSVG
                      path="/media/icons/duotune/arrows/arr064.svg"
                      className="svg-icon-3 ms-1 me-0"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>,
    modalsRoot
  );
};

export { CreateWABATemplateModal };
