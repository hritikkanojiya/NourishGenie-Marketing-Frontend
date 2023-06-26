/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { AppMySQLCrypt } from "../../models/mysql_crypt_config/app_mysql_crypt.model";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../../common/toastify/toastify.config";
import { AppMySQLCryptService } from "../../services/mysql_crypt_config/app_mysql_crypt.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createAppMySQLCryptSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  secret_key_path: Yup.string().trim().required("Secret key path is required"),
});

let initialValues = {
  name: "",
  description: "",
  secret_key_path: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  mysqlCrypt?: AppMySQLCrypt | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  mysqlCrypt?: AppMySQLCrypt | {};
};

export const AppMySQLCryptModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  mysqlCrypt,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    mysqlCrypt: undefined,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createAppMySQLCryptSchema,
    enableReinitialize: true,
    onSubmit: async (descriptions, { setStatus, setSubmitting }) => {
      setLoading(true);
      const mysqlCryptDetails: any = {
        name: descriptions.name,
        description: descriptions.description,
        secret_key_path: descriptions.secret_key_path,
      };
      if (!state.editMode) {
        const request = await AppMySQLCryptService.createMySQLCrypt(
          mysqlCryptDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.mysqlCrypt && "name" in state.mysqlCrypt) {
          mysqlCryptDetails.appMySQLCryptId =
            state.mysqlCrypt.appMySQLCryptId || "";
          const request = await AppMySQLCryptService.updateMySQLCrypt(
            mysqlCryptDetails
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
    if ((editMode || readOnlyMode) && mysqlCrypt) {
      if ("name" in mysqlCrypt) {
        setState((prevState) => {
          return { ...prevState, mysqlCrypt: mysqlCrypt };
        });
        initialValues = {
          name: mysqlCrypt.name,
          description: mysqlCrypt.description,
          secret_key_path: mysqlCrypt.secret_key_path,
        };
      }
    } else {
      initialValues = {
        name: "",
        description: "",
        secret_key_path: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, mysqlCrypt]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | MySQL Crypts
            {showModal
              ? ` | ${
                  state.readOnlyMode && mysqlCrypt
                    ? initialValues.name
                    : state.editMode
                    ? `Update MySQL Crypt`
                    : `Create MySQL Crypt`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && mysqlCrypt
            ? initialValues.name
            : state.editMode
            ? "Update MySQL Crypt"
            : "Create MySQL Crypt"
        }
        id="addConstant"
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
              placeholder="Enter MySQL crypt name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Secret Key Path
              </span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("secret_key_path")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.secret_key_path &&
                    formik.errors.secret_key_path,
                },
                {
                  "is-valid":
                    formik.touched.secret_key_path &&
                    !formik.errors.secret_key_path,
                }
              )}
              placeholder="Enter secret key path"
            />
            {formik.touched.secret_key_path && formik.errors.secret_key_path && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.secret_key_path}</span>
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
              placeholder="Value for the app constant"
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
