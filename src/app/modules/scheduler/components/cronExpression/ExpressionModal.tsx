/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { CronExpression } from "../../models/cron_expression.model";
import { CronExpressionService } from "../../services/cron_expression.service";
import { isValidCron } from "cron-validator";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createCronExpressionSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  expression: Yup.string()
    .required("Cron expression is required")
    .test("isValidCron", "Invalid cron expression", (value) => {
      if (!value || value.length <= 1) {
        return true;
      }
      return isValidCron(value);
    })
    .required("Cron Expression is required"),
});

let initialValues = {
  name: "",
  description: "",
  expression: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  cronExpression?: CronExpression | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  cronExpression?: CronExpression | {};
};

export const CronExpressionModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  cronExpression,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    cronExpression: undefined,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createCronExpressionSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const expressionDetail: any = {
        name: values.name,
        description: values.description,
        expression: values.expression,
      };
      if (!state.editMode) {
        const request = await CronExpressionService.createCronExpression(
          expressionDetail
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.cronExpression && "name" in state.cronExpression) {
          expressionDetail.appCronExpressionId =
            state.cronExpression.appCronExpressionId || "";
          const request = await CronExpressionService.updateCronExpression(
            expressionDetail
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
    if ((editMode || readOnlyMode) && cronExpression) {
      if ("name" in cronExpression) {
        setState((prevState) => {
          return { ...prevState, cronExpression: cronExpression };
        });
        initialValues = {
          name: cronExpression.name,
          description: cronExpression.description,
          expression: cronExpression.expression,
        };
      }
    } else {
      initialValues = {
        name: "",
        description: "",
        expression: "",
      };
    }
  }, [showModal, editMode, readOnlyMode, cronExpression]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Cron Expressions
            {showModal
              ? ` | ${
                  readOnlyMode && cronExpression
                    ? initialValues.name
                    : editMode
                    ? `Update Cron Expression`
                    : `Create Cron Expression`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && cronExpression
            ? initialValues.name
            : state.editMode
            ? "Update Cron Expression"
            : "Create Cron Expression"
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
              placeholder="Enter a access group name"
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
                Cron Expression
              </span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("expression")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.expression && formik.errors.expression,
                },
                {
                  "is-valid":
                    formik.touched.expression && !formik.errors.expression,
                }
              )}
              placeholder="Enter cron expression"
            />
            {formik.touched.expression && formik.errors.expression && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.expression}</span>
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
