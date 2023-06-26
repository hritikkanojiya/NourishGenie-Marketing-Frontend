/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../../common/toastify/toastify.config";
import { MSG91Sender } from "../../models/sender/sender.model";
import { SenderService } from "../../services/sender/sender.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createMSG91SenderSchema = Yup.object().shape({
  MSG91SenderId: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
});

let initialValues = {
  MSG91SenderId: "",
  description: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  sender?: MSG91Sender | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  sender?: MSG91Sender | {};
};

export const MSG91SenderModal: FC<Props> = ({
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
    validationSchema: createMSG91SenderSchema,
    enableReinitialize: true,
    onSubmit: async (descriptions, { setStatus, setSubmitting }) => {
      setLoading(true);
      const senderDetails: any = {
        MSG91SenderId: descriptions.MSG91SenderId,
        description: descriptions.description,
      };
      if (!state.editMode) {
        const request = await SenderService.createSender(senderDetails);
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.sender && "MSG91SenderId" in state.sender) {
          senderDetails.appMSG91SenderId = state.sender.appMSG91SenderId || "";
          const request = await SenderService.updateSender(senderDetails);
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
      if ("MSG91SenderId" in sender) {
        setState((prevState) => {
          return { ...prevState, sender: sender };
        });
        initialValues = {
          MSG91SenderId: sender.MSG91SenderId,
          description: sender.description,
        };
      }
    } else {
      initialValues = {
        MSG91SenderId: "",
        description: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, sender]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | MSG91 Sender
            {showModal
              ? ` | ${
                  state.readOnlyMode && sender
                    ? initialValues.MSG91SenderId
                    : state.editMode
                    ? `Update MSG91 Sender`
                    : `Create MSG91 Sender`
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
            ? initialValues.MSG91SenderId
            : state.editMode
            ? "Update MSG91 Sender"
            : "Create MSG91 Sender"
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
              {...formik.getFieldProps("MSG91SenderId")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.MSG91SenderId && formik.errors.MSG91SenderId,
                },
                {
                  "is-valid":
                    formik.touched.MSG91SenderId &&
                    !formik.errors.MSG91SenderId,
                }
              )}
              placeholder="Enter MSG91SenderId"
            />
            {formik.touched.MSG91SenderId && formik.errors.MSG91SenderId && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.MSG91SenderId}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
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
              placeholder="Description"
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
