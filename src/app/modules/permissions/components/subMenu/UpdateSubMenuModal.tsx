/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { AppSubMenuModel } from "../../models/app_sub_menu.model";
import { AppSubMenuService } from "../../services/app_sub_menu.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const updateSubMenuSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  url: Yup.string().trim().required("Description is required"),
});

let initialValues: {
  name: string;
  description: string;
  url: string;
} = {
  name: "",
  description: "",
  url: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appSubMenu?: AppSubMenuModel | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appSubMenu?: AppSubMenuModel | {};
};

export const UpdateSubMenuModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  appSubMenu,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    appSubMenu: undefined,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: updateSubMenuSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      if (editMode && state.appSubMenu && "appSubMenuId" in state.appSubMenu) {
        const data: AppSubMenuModel = {
          name: values.name,
          description: values.description,
          url: values.url,
          appMenuId: state.appSubMenu.appMenuId,
          appSubMenuId: state.appSubMenu.appSubMenuId,
        };
        const request = await AppSubMenuService.updateSubMenu(data);
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
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
    if ((editMode || readOnlyMode) && appSubMenu) {
      if ("appSubMenuId" in appSubMenu) {
        setState((prevState) => {
          return { ...prevState, appSubMenu: appSubMenu };
        });
        initialValues = {
          name: appSubMenu.name,
          description: appSubMenu.description,
          url: appSubMenu.url,
        };
      }
    } else {
      initialValues = {
        name: "",
        description: "",
        url: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, appSubMenu]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Sub Menus
            {showModal
              ? ` | ${
                  state.readOnlyMode && appSubMenu
                    ? initialValues.name
                    : state.editMode
                    ? `Update Sub Menu`
                    : `Create Sub Menu`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && appSubMenu
            ? initialValues.name
            : state.editMode
            ? "Update Sub Menu"
            : "Create Sub Menu"
        }
        id="subMenuModalOpr"
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
              placeholder="Enter a sub-menu name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>URL</span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("url")}
              className={clsx(
                "form-control bg-transparent py-2",
                { "is-invalid": formik.touched.url && formik.errors.url },
                {
                  "is-valid": formik.touched.url && !formik.errors.url,
                }
              )}
              placeholder="Enter a sub-menu URL"
            />
            {formik.touched.url && formik.errors.url && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.url}</span>
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
              placeholder="Description for sub-menu"
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
