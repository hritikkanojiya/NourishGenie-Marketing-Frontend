/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { Option } from "../../../common/globals/common.model";
import { ModalComponent } from "../../../common/components/modal/Modal";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../common/toastify/toastify.config";
import { AppContact } from "../models/app_contacts.model";
import { AppContactService } from "../services/app_contact.service";
import { AppListService } from "../../lists/services/app_list.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const numbersTest = (num: number | undefined): boolean => {
  if (!num) return true;
  const stringValue = String(num);
  return /^[1-9]\d{9}$/.test(stringValue);
};

const createAppContactSchema = Yup.object().shape({
  ngUserId: Yup.number().integer().positive().required("ngUserId is required."),
  firstName: Yup.string().trim().required("First Name is required."),
  lastName: Yup.string().trim().required("Last Name is required."),
  email: Yup.string().email().trim().required("Email is required."),
  mobile: Yup.number()
    .integer()
    .positive()
    .min(1, "Please enter a valid number")
    .test("minDigits", "Atleast 10 digits are required", numbersTest)
    .required("Mobile is required."),
  mobileDialCode: Yup.number()
    .integer()
    .positive()
    .min(1, "Please enter a valid dial code")
    .required("Mobile dial code is required."),
  smsNumber: Yup.number()
    .integer()
    .positive()
    .min(1, "Please enter a valid number")
    .test("minDigits", "Atleast 10 digits are required", numbersTest)
    .required("SMS Number is required."),
  whatsappNumber: Yup.number()
    .integer()
    .positive()
    .min(1, "Please enter a valid number")
    .test("minDigits", "Atleast 10 digits are required", numbersTest)
    .required("Whatsapp number is required."),
  deviceId: Yup.string().trim().required("Device Id is required."),
  appListIds: Yup.array().of(Yup.string().trim()),
});

let initialValues = {
  ngUserId: 1,
  firstName: "",
  lastName: "",
  email: "",
  mobile: 0,
  mobileDialCode: 0,
  smsNumber: 0,
  whatsappNumber: 0,
  deviceId: "",
  appListIds: [],
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appContact?: AppContact | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appContact?: AppContact | {};
};

export const AppContactModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  appContact,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    appContact: undefined,
  });
  const [listIdOptions, setListIdOptions] = useState<Option[]>([]);
  const [listId, setListIds] = useState<Option[]>([]);

  const getAppListIds = async () => {
    const request = await AppListService.getAppLists();
    if ("data" in request) {
      const data = request.data.appLists?.map((list) => {
        return { label: list.name, value: list.appListId };
      });
      setListIdOptions(data);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createAppContactSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      console.log(values);
      const appContactDetails: any = {
        ngUserId: values.ngUserId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        mobile: values.mobile.toString(),
        mobileDialCode: values.mobileDialCode.toString(),
        smsNumber: values.smsNumber.toString(),
        whatsappNumber: values.whatsappNumber.toString(),
        deviceId: values.deviceId,
        appListIds: values.appListIds,
      };
      if (!state.editMode) {
        const request = await AppContactService.createAppContact(
          appContactDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.appContact && "email" in state.appContact) {
          appContactDetails.appContactId = state.appContact.appContactId || "";
          delete appContactDetails.appListIds;
          const request = await AppContactService.updateAppContact(
            appContactDetails
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

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "mobile") {
      formik.setFieldValue("mobile", value);
      if (!formik.touched.whatsappNumber)
        formik.setFieldValue("whatsappNumber", value);
      if (!formik.touched.smsNumber) formik.setFieldValue("smsNumber", value);
    } else if (name === "smsNumber") {
      formik.setFieldValue("smsNumber", value);
    } else if (name === "whatsappNumber") {
      formik.setFieldValue("whatsappNumber", value);
    }
  };

  useEffect(() => {
    getAppListIds();
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
    if ((editMode || readOnlyMode) && appContact) {
      if ("email" in appContact) {
        setState((prevState) => {
          return { ...prevState, appContact: appContact };
        });
        initialValues = {
          deviceId: appContact.pushNotificationConfiguration.deviceId,
          email: appContact.email,
          firstName: appContact.firstName,
          lastName: appContact.lastName,
          mobile: Number(appContact.mobile),
          mobileDialCode: Number(appContact.mobileDialCode),
          ngUserId: appContact.ngUserId,
          smsNumber: Number(appContact.smsConfiguration.smsNumber),
          whatsappNumber: Number(
            appContact.whatsAppConfiguration.whatsappNumber
          ),
          appListIds: [],
        };
      }
    } else {
      initialValues = {
        deviceId: "",
        email: "",
        firstName: "",
        lastName: "",
        mobile: 0,
        mobileDialCode: 0,
        ngUserId: 0,
        smsNumber: 0,
        whatsappNumber: 0,
        appListIds: [],
      };
      setListIds([]);
    }
  }, [showModal, editMode, readOnlyMode, appContact]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Contacts
            {showModal
              ? ` | ${state.readOnlyMode && appContact
                ? initialValues.firstName
                : state.editMode
                  ? `Update Contact`
                  : `Create Contact`
              }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && appContact
            ? initialValues.firstName
            : state.editMode
              ? "Update Contact"
              : "Create Contact"
        }
        id="addContact"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  First Name
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("firstName")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.firstName && formik.errors.firstName,
                  },
                  {
                    "is-valid":
                      formik.touched.firstName && !formik.errors.firstName,
                  }
                )}
                placeholder="Enter contact's first name"
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.firstName}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Last Name
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("lastName")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.lastName && formik.errors.lastName,
                  },
                  {
                    "is-valid":
                      formik.touched.lastName && !formik.errors.lastName,
                  }
                )}
                placeholder="Enter contact's last name"
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.lastName}</span>
                </div>
              )}
            </div>
          </div>
          {!editMode && !readOnlyMode && (
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  List IDs
                </span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  {
                    "is-invalid":
                      formik.touched.appListIds && formik.errors.appListIds,
                  },
                  {
                    "is-valid":
                      formik.touched.appListIds && !formik.errors.appListIds,
                  }
                )}
                backspaceRemovesValue={true}
                onChange={(options) => {
                  let selectedValues: any = options?.map((option) => {
                    return option?.value;
                  });
                  formik.setFieldValue("appListIds", selectedValues || []);
                  selectedValues = options?.map((option) => {
                    return { label: option.label, value: option.value };
                  });
                  setListIds(selectedValues);
                }}
                value={listId}
                options={listIdOptions}
                onBlur={formik.handleBlur}
                isMulti={true}
              />
              {formik.touched.deviceId && formik.errors.deviceId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.deviceId}</span>
                </div>
              )}
            </div>
          )}
          <div className="fv-row row mb-5">
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  NG User ID
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("ngUserId")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.ngUserId && formik.errors.ngUserId,
                  },
                  {
                    "is-valid":
                      formik.touched.ngUserId && !formik.errors.ngUserId,
                  }
                )}
                placeholder="Enter User Id"
              />
              {formik.touched.ngUserId && formik.errors.ngUserId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.ngUserId}</span>
                </div>
              )}
            </div>
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Email
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("email")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  { "is-invalid": formik.touched.email && formik.errors.email },
                  {
                    "is-valid": formik.touched.email && !formik.errors.email,
                  }
                )}
                placeholder="Enter contact's email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.email}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row row mb-5">
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Mobile Dial Code
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("mobileDialCode")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.mobileDialCode &&
                      formik.errors.mobileDialCode,
                  },
                  {
                    "is-valid":
                      formik.touched.mobileDialCode &&
                      !formik.errors.mobileDialCode,
                  }
                )}
                placeholder="Enter dial code"
              />
              {formik.touched.mobileDialCode && formik.errors.mobileDialCode && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.mobileDialCode}</span>
                </div>
              )}
            </div>
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Mobile
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("mobile")}
                onChange={handleValueChange}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid": formik.touched.mobile && formik.errors.mobile,
                  },
                  {
                    "is-valid": formik.touched.mobile && !formik.errors.mobile,
                  }
                )}
                placeholder="Enter mobile number"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.mobile}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row row mb-5">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Whatsapp Number
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("whatsappNumber")}
                onChange={handleValueChange}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.whatsappNumber &&
                      formik.errors.whatsappNumber,
                  },
                  {
                    "is-valid":
                      formik.touched.whatsappNumber &&
                      !formik.errors.whatsappNumber,
                  }
                )}
                placeholder="Enter whatsapp number"
              />
              {formik.touched.whatsappNumber && formik.errors.whatsappNumber && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.whatsappNumber}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  SMS Number
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="number"
                {...formik.getFieldProps("smsNumber")}
                onChange={handleValueChange}
                className={clsx(
                  "form-control bg-transparent py-2",
                  {
                    "is-invalid":
                      formik.touched.smsNumber && formik.errors.smsNumber,
                  },
                  {
                    "is-valid":
                      formik.touched.smsNumber && !formik.errors.smsNumber,
                  }
                )}
                placeholder="Enter sms Number"
              />
              {formik.touched.smsNumber && formik.errors.smsNumber && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.smsNumber}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Device ID
              </span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("deviceId")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.deviceId && formik.errors.deviceId,
                },
                {
                  "is-valid":
                    formik.touched.deviceId && !formik.errors.deviceId,
                }
              )}
              placeholder="Enter device id"
            />
            {formik.touched.deviceId && formik.errors.deviceId && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.deviceId}</span>
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
