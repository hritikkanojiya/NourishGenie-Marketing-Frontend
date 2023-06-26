/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { AccessGroupService } from "../../services/access_group.service";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { Option } from "../../../../common/globals/common.model";
import { AccessGroupModel } from "../../models/access_group.model";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createAccessGroupSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  isAdministrator: Yup.string()
    .trim()
    .oneOf(["true", "false"])
    .required("Admin flag is required")
    .nullable(),
});

const updateAccessGroupSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  isAdministrator: Yup.string()
    .trim()
    .oneOf(["true", "false"])
    .required("Admin flag is required")
    .nullable(),
});

let initialValues: {
  name: string;
  description: string;
  isAdministrator: boolean | null | string;
} = {
  name: "",
  description: "",
  isAdministrator: null,
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  accessGroupDetails?: AccessGroupModel | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  accessGroupDetails?: AccessGroupModel | {};
};

export const AccessGroupModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  accessGroupDetails,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    accessGroupDetails: undefined,
  });
  const [, setSelectState] = useState<{ isAdmin: Option }>({
    isAdmin: { label: "", value: null },
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: state.editMode
      ? updateAccessGroupSchema
      : createAccessGroupSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      const accessGroupDetail: any = {
        name: values.name,
        description: values.description,
        isAdministrator: values.isAdministrator,
      };
      if (!state.editMode) {
        const request = await AccessGroupService.createAccessGroup(
          accessGroupDetail
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.accessGroupDetails && "name" in state.accessGroupDetails) {
          accessGroupDetail.appAccessGroupId =
            state.accessGroupDetails.appAccessGroupId || "";
          const request = await AccessGroupService.updateAccessGroup(
            accessGroupDetail
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
    if ((editMode || readOnlyMode) && accessGroupDetails) {
      if ("appAccessGroupId" in accessGroupDetails) {
        setState((prevState) => {
          return { ...prevState, accessGroupDetails: accessGroupDetails };
        });
        initialValues = {
          name: accessGroupDetails.name,
          description: accessGroupDetails.description,
          isAdministrator: accessGroupDetails.isAdministrator.toString(),
        };
        setSelectState({
          isAdmin: {
            label: initialValues.isAdministrator ? "Yes" : "No",
            value: initialValues.isAdministrator,
          },
        });
      }
    } else {
      initialValues = {
        name: "",
        description: "",
        isAdministrator: null,
      };
      setSelectState({ isAdmin: { label: "", value: null } });
    }
  }, [showModal, editMode, readOnlyMode, accessGroupDetails]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Access Groups
            {showModal
              ? ` | ${
                  state.readOnlyMode && accessGroupDetails
                    ? initialValues.name
                    : state.editMode
                    ? `Update Access Group`
                    : `Create Access Group`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && accessGroupDetails
            ? initialValues.name
            : state.editMode
            ? "Update Access Group"
            : "Create Access Group"
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
                placeholder="Enter a access group name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              )}
            </div>
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                Admin
              </label>
              <div className="fv-row row">
                <div className="col-6">
                  <div data-kt-buttons="true">
                    <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success px-2 w-100">
                      <div className="d-flex align-items-center justify-content-evenly">
                        <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                          <input
                            disabled={readOnlyMode}
                            className="form-check-input w-15px h-15px"
                            type="radio"
                            {...formik.getFieldProps("isAdministrator")}
                            value={"true"}
                            checked={formik.values.isAdministrator === "true"}
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
                            disabled={readOnlyMode}
                            className="form-check-input w-15px h-15px"
                            type="radio"
                            {...formik.getFieldProps("isAdministrator")}
                            value={"false"}
                            checked={formik.values.isAdministrator === "false"}
                          />
                        </div>
                        <div className="fw-bold">No</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {formik.touched.isAdministrator && formik.errors.isAdministrator && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.isAdministrator}</span>
                </div>
              )}
            </div>
          </div>
          <div className="fv-row ">
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
              placeholder="Description for access group"
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
