/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal } from "react-bootstrap";
import { StepperComponent } from "../../../../../_metronic/assets/ts/components";
import { KTSVG } from "../../../../../_metronic/helpers";
import { BasicDetailsStep } from "./steps/BasicDetails";
import { useFormik } from "formik";
import { PlatformDetails } from "./steps/Platforms";
import { EmailStepper } from "./steps/Email";
import { SMSStepper } from "./steps/SMS";
import { PushNotificationStep } from "./steps/PushNotification";
import { WhatsAppStep } from "./steps/Whatsapp";
import { showToast } from "../../../../common/toastify/toastify.config";
import { AppCampaignService } from "../../services/campaign.service";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../../common/globals/common.constants";

type Props = {
  show: boolean;
  handleClose: () => void;
};

// const createCampaignSchema = Yup.object().shape({
//   name: Yup.string().trim().required("Name is required"),
//   description: Yup.string().required("Description is required"),
//   platforms: Yup.object().shape({
//     email: Yup.object().shape({
//       sendInBlue: Yup.object().shape({
//         appSendInBlueTemplateId: Yup.string().trim(),
//       }),
//       config: Yup.object().shape({
//         senderId: Yup.string().trim(),
//       })
//     }).nullable(true),
//     whatsapp: Yup.mixed().nullable(),
//     sms: Yup.object().shape({
//       msg91: Yup.object().shape({
//         appMSG91FlowId: Yup.string().trim(),
//       }),
//       config: Yup.object().shape({
//         senderId: Yup.string().trim(),
//       })
//     }).nullable(),
//     pushNotification: Yup.object().shape({
//       firebase: Yup.object().shape({
//         appFirebaseTemplateId: Yup.string().trim()
//       })
//     }).nullable(),
//   }),
//   tag: Yup.array().of(Yup.string().trim()).min(1).required("Tag is required"),
//   utmCampaign: Yup.string().trim().required(),
// })

const initialValues: any = {
  name: "",
  description: "",
  appListIds: [],
  platforms: {},
  tag: [],
  utmCampaign: "",
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const CreateAppCampaignModal = ({ show, handleClose }: Props) => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const stepper = useRef<StepperComponent | null>(null);
  const [hasError, setHasError] = useState(false);
  const [platforms, setPlatForms] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(
      stepperRef.current as HTMLDivElement
    );
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      const request = await AppCampaignService.createAppCampaign(values);
      if ("data" in request) {
        showToast(request.data.message, "success");
        handleClose();
      }
      setLoading(false);
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

    const currentStep = stepper.current.currentStepIndex;

    if (currentStep === 1) {
      if (
        !formik.values.name ||
        !formik.values.description ||
        formik.values.appListIds?.length <= 0 ||
        formik.values.tag?.length <= 0 ||
        !formik.values.utmCampaign
      ) {
        return;
      }
    }

    if (currentStep === 2) {
      if (platforms?.length <= 0 || services?.length <= 0) {
        return;
      }
    }

    const nextStep = stepper.current.getNextStepIndex();

    switch (nextStep) {
      case 3:
        if (platforms.includes("email")) break;
        else stepper.current.goto(4);
        break;
      case 4:
        if (platforms.includes("sms")) break;
        else stepper.current.goto(5);
        break;
      case 5:
        if (platforms.includes("whatsapp")) break;
        else stepper.current.goto(6);
        break;
      case 6:
        if (platforms.includes("pushNotification")) break;
        else stepper.current.goto(7);
        break;
      default:
        break;
    }

    stepper.current.goNext();
  };

  useEffect(() => {
    if (!show) formik.resetForm();
  }, [show]);

  return createPortal(
    <>
      {show && (
        <Helmet>
          <title>{APP_NAME} | Campaigns | Create Campaign</title>
        </Helmet>
      )}
      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-900px"
        show={show}
        onHide={handleClose}
        onEntered={loadStepper}
        backdrop={"static"}
        size="xl"
      >
        <div className="modal-header">
          <h2>Create App Campaign</h2>
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
            <div className="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
              <div className="stepper-nav ps-lg-10">
                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">1</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">Basic Details</h3>
                      <div className="stepper-desc">
                        Enter basic details for this campaign
                      </div>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">2</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">Platforms</h3>
                      <div className="stepper-desc">Select Platforms</div>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">3</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">Email</h3>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">4</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">SMS</h3>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">5</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">WhatsApp</h3>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">6</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">Push Notification</h3>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">7</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">Completed</h3>
                      <div className="stepper-desc">Review and Submit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-row-fluid py-lg-5 px-lg-15">
              <form
                noValidate
                id="kt_modal_create_app_form"
                onSubmit={formik.handleSubmit}
              >
                <BasicDetailsStep hasError={hasError} formik={formik} />
                <PlatformDetails
                  hasError={hasError}
                  formik={formik}
                  platforms={platforms}
                  setPlatforms={setPlatForms}
                  services={services}
                  setService={setServices}
                />
                <EmailStepper
                  formik={formik}
                  hasError={hasError}
                  services={services}
                />
                <SMSStepper
                  formik={formik}
                  hasError={hasError}
                  services={services}
                />
                <WhatsAppStep
                  formik={formik}
                  hasError={hasError}
                  services={services}
                />
                <PushNotificationStep
                  formik={formik}
                  hasError={hasError}
                  services={services}
                />
                <div className="d-flex flex-stack pt-10">
                  <div className="me-2">
                    <button
                      type="button"
                      className="btn btn-lg btn-light-primary me-3"
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
                  </div>
                  <div>
                    <button
                      disabled={loading}
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

export { CreateAppCampaignModal };
