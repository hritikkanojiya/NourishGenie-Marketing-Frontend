/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { FirebaseTemplate } from "../../models/firebase_template.model";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { FirebaseTemplateService } from "../../services/firebase.service";
import { showToast } from "../../../../common/toastify/toastify.config";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createFirebaseTemplateSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  title: Yup.string().trim().required("Title is required"),
  body: Yup.string().trim().required("Body is required"),
  data: Yup.mixed().nullable(),
});

let initialValues: FirebaseTemplate = {
  name: "",
  title: "",
  body: "",
  data: {},
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  firebaseTemplate?: FirebaseTemplate | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  firebaseTemplate?: FirebaseTemplate | {};
};

export const FirebaseTemplateModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  firebaseTemplate,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    firebaseTemplate: undefined,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createFirebaseTemplateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const firebaseTemplateDetails: any = {
        name: values.name,
        title: values.title,
        body: values.body,
        data: values.data || {},
      };
      if (!state.editMode) {
        const request = await FirebaseTemplateService.createFirebaseTemplate(
          firebaseTemplateDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.firebaseTemplate && "title" in state.firebaseTemplate) {
          firebaseTemplateDetails.appFirebaseTemplateId =
            state.firebaseTemplate.appFirebaseTemplateId || "";
          const request = await FirebaseTemplateService.updateFirebaseTemplate(
            firebaseTemplateDetails
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
    if ((editMode || readOnlyMode) && firebaseTemplate) {
      if ("name" in firebaseTemplate) {
        setState((prevState) => {
          return { ...prevState, firebaseTemplate: firebaseTemplate };
        });
        initialValues = {
          name: firebaseTemplate.name,
          body: firebaseTemplate.body,
          data: firebaseTemplate.data,
          title: firebaseTemplate.title,
        };
      }
    } else {
      initialValues = {
        name: "",
        body: "",
        data: "",
        title: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, firebaseTemplate]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Firebase Templates
            {showModal
              ? ` | ${
                  state.readOnlyMode && firebaseTemplate
                    ? initialValues.name
                    : state.editMode
                    ? `Update Firebase Template`
                    : `Create Firebase Template`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && firebaseTemplate
            ? initialValues.name
            : state.editMode
            ? "Update Firebase Template"
            : "Create Firebase Template"
        }
        id="addRoute"
        modalSize="modal-lg"
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
                  Name
                </span>
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
                placeholder="Enter template name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Title
                </span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("title")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  { "is-invalid": formik.touched.title && formik.errors.title },
                  {
                    "is-valid": formik.touched.title && !formik.errors.title,
                  }
                )}
                placeholder="Enter title"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.title}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Body</span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("body")}
              rows={3}
              placeholder="Body of the template"
            ></textarea>
            {formik.touched.body && formik.errors.body && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.body}</span>
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
