import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { AuthService } from "../services/auth.service";
import { showToast } from "../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../common/globals/common.constants";

const initialValues = {
  email: "",
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Please provide a valid email")
    .lowercase()
    .required("Email is required"),
});

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const location: any = useLocation().state;
  if (location?.email) {
    initialValues.email = location.email;
  }
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const response = await AuthService.forgotPassword(formik.values.email);
        if (
          "data" in response &&
          "message" in response.data &&
          response.data.mailInfo
        ) {
          showToast(response.data.message, "success");
        } else {
          setHasErrors(true);
        }
      } catch (error) {
        setSubmitting(false);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Auth | Forgot Password</title>
      </Helmet>
      <form
        className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
        noValidate
        id="kt_login_password_reset_form"
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-10">
          {/* begin::Title */}
          <h1 className="text-dark fw-bolder mb-3">Forgot Password ?</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className="text-gray-500 fw-semibold fs-6">
            Enter email to reset your password.
          </div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
          <div className="mb-lg-15 alert alert-danger">
            <div className="alert-text font-weight-bold">
              Sorry, looks like there are some errors detected, please try
              again.
            </div>
          </div>
        )}

        {hasErrors === false && (
          <div className="mb-10 bg-light-info p-8 rounded">
            <div className="text-info">
              Sent password reset. Please check your email
            </div>
          </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className="fv-row mb-8">
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            {...formik.getFieldProps("email")}
            className={clsx(
              "form-control bg-transparent",
              { "is-invalid": formik.touched.email && formik.errors.email },
              {
                "is-valid": formik.touched.email && !formik.errors.email,
              }
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className="d-flex flex-wrap justify-content-evenly pb-lg-0">
          <LoadingButton
            btnText="Submit"
            loading={loading}
            disableBtn={formik.isSubmitting || !formik.isValid || loading}
            btnClass={"btn btn-primary me-4"}
          />
          <Link to="/auth/login">
            <button
              type="button"
              id="kt_login_password_reset_form_cancel_button"
              className="btn btn-secondary"
              disabled={formik.isSubmitting || !formik.isValid || loading}
            >
              Cancel
            </button>
          </Link>{" "}
        </div>
        {/* end::Form group */}
      </form>
    </>
  );
}
