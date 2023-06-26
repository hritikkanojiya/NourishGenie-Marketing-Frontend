/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { AppConstant } from "../models/app_constants.model";
import { ModalComponent } from "../../../common/components/modal/Modal";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../common/toastify/toastify.config";
import { AppConstantService } from "../services/app_constants.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const createAppConstantSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  value: Yup.string().trim().required("Value is required"),
  isAutoLoad: Yup.boolean().required("Admin flag is required").nullable(),
});

let initialValues: AppConstant = {
  name: "",
  value: "",
  isAutoLoad: false,
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appConstant?: AppConstant | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appConstant?: AppConstant | {};
};

export const AppConstantModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  appConstant,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    appConstant: undefined,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createAppConstantSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const appConstantDetails: any = {
        name: values.name,
        value: values.value,
        isAutoLoad: values.isAutoLoad,
      };
      if (!state.editMode) {
        const request = await AppConstantService.createAppConstant(
          appConstantDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.appConstant && "name" in state.appConstant) {
          appConstantDetails.appConstantId =
            state.appConstant.appConstantId || "";
          const request = await AppConstantService.updateAppConstants(
            appConstantDetails
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
    if ((editMode || readOnlyMode) && appConstant) {
      if ("name" in appConstant) {
        setState((prevState) => {
          return { ...prevState, appConstant: appConstant };
        });
        initialValues = {
          name: appConstant.name,
          value: appConstant.value,
          isAutoLoad: appConstant.isAutoLoad.toString(),
        };
      }
    } else {
      initialValues = {
        name: "",
        value: "",
        isAutoLoad: false,
      };
    }
  }, [showModal, editMode, readOnlyMode, appConstant]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Constants
            {showModal
              ? ` | ${
                  state.readOnlyMode && appConstant
                    ? initialValues.name
                    : state.editMode
                    ? `Update Constant`
                    : `Create Constant`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && appConstant
            ? initialValues.name
            : state.editMode
            ? "Update Constant"
            : "Create Constant"
        }
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-8">
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
                placeholder="Enter constant name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              )}
            </div>
            <div className="col-4">
              <div className="fv-row row mb-5">
                <label className="form-label fw-bold">Auto Load</label>
                <div className="col-6">
                  <div data-kt-buttons="true">
                    <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success w-100">
                      <div className="d-flex align-items-center justify-content-evenly">
                        <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                          <input
                            disabled={readOnlyMode}
                            className="form-check-input w-15px h-15px"
                            type="radio"
                            {...formik.getFieldProps("isAutoLoad")}
                            value={true.toString()}
                            checked={formik.values.isAutoLoad === "true"}
                          />
                        </div>
                        <div className="fw-bold">Yes</div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div data-kt-buttons="true">
                    <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-danger w-100">
                      <div className="d-flex align-items-center justify-content-evenly">
                        <div className="form-check form-check-custom form-check-solid form-check-danger pe-1">
                          <input
                            disabled={readOnlyMode}
                            className="form-check-input w-15px h-15px"
                            type="radio"
                            {...formik.getFieldProps("isAutoLoad")}
                            checked={formik.values.isAutoLoad === "false"}
                            value={false.toString()}
                          />
                        </div>
                        <div className="fw-bold">No</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {formik.touched.isAutoLoad && formik.errors.isAutoLoad && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.isAutoLoad}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Value</span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("value")}
              rows={3}
              placeholder="Value for the app constant"
            ></textarea>
            {formik.touched.value && formik.errors.value && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.value}</span>
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
