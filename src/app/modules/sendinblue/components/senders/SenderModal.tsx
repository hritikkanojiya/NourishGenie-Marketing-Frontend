/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { SendInBlueSender } from "../../models/sendinblue_sender.model";
import { SendInBlueSenderService } from "../../services/sendinblue_sender.service";
import { showToast } from "../../../../common/toastify/toastify.config";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createSenderSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().email().trim().required("Email is required"),
  description: Yup.string().trim().required("Description is required"),
});

let initialValues = {
  name: "",
  email: "",
  description: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  sender?: SendInBlueSender | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  sender?: SendInBlueSender | {};
};

export const SendInBlueSenderModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  sender,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    sender: undefined,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSenderSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const senderDetails: any = {
        name: values.name,
        description: values.description,
        email: values.email,
      };
      if (!state.editMode) {
        const request = await SendInBlueSenderService.createSender(
          senderDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.sender && "name" in state.sender) {
          senderDetails.appSendInBlueSenderId =
            state.sender.appSendInBlueSenderId || "";
          const request = await SendInBlueSenderService.updateSender(
            senderDetails
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
    if ((editMode || readOnlyMode) && sender) {
      if ("name" in sender) {
        setState((prevState) => {
          return { ...prevState, sender: sender };
        });
        initialValues = {
          name: sender.name,
          email: sender.email,
          description: sender.description,
        };
      }
    } else {
      initialValues = {
        name: "",
        email: "",
        description: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, sender]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | SendInBlue Senders
            {showModal
              ? ` | ${
                  state.readOnlyMode && sender
                    ? initialValues.name
                    : state.editMode
                    ? `Update SendInBlue Sender`
                    : `Create SendInBlue Sender`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && sender
            ? initialValues.name
            : state.editMode
            ? "Update SendInBlue Sender"
            : "Create SendInBlue Sender"
        }
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Name</span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("name")}
              className={clsx(
                "form-control bg-transparent py-2",
                { "is-invalid": formik.touched.name && formik.errors.name },
                {
                  "is-valid": formik.touched.name && !formik.errors.name,
                }
              )}
              placeholder="Enter Name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Email</span>
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
              placeholder="Enter Email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )}
          </div>
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Description
              </span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("description")}
              rows={5}
              placeholder="Description for the list"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.description}</span>
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
