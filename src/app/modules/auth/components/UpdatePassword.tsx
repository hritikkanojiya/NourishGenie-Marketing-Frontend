import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { AuthService } from "../services/auth.service";
import { showToast } from "../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../common/globals/common.constants";

const initialValues = {
  password: "",
  cfmPassword: "",
};

const updatePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(8, "Minimum 8 characters")
    .max(16, "Maximum 16 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,}/,
      "Password should have atleast one uppercase, lowercase and a special character and should be atleast 8 characters long"
    )
    .required("New password is required"),
  cfmPassword: Yup.string()
    .trim()
    .min(8, "Minimum 8 characters")
    .max(16, "Maximum 16 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,}/,
      "Password should have atleast one uppercase, lowercase and a special character and should be atleast 8 characters long"
    )
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

const isValidToken = async (
  token: string,
  secret: string
): Promise<boolean> => {
  try {
    const response = await AuthService.verifyPasswordToken(token, secret);
    if ("data" in response && "message" in response.data) {
      const returnValue = typeof response.error === "boolean";
      return returnValue;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export function UpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();
  const { token, secret } = useParams();
  if (token && secret && !tokenVerified) {
    isValidToken(token, secret)
      .then((data) => {
        if (!data) {
          navigate("/agent/auth/login");
        } else {
          setTokenVerified(true);
        }
      })
      .catch((error: any) => {
        navigate("/agent/auth/login");
      });
  }

  const formik = useFormik({
    initialValues,
    validationSchema: updatePasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (token && secret) {
          const response = await AuthService.updatePassword(
            token,
            secret,
            formik.values.password,
            formik.values.cfmPassword
          );
          if (
            "data" in response &&
            "message" in response.data &&
            response.data.appAgentAccDetails
          ) {
            navigate("/agent/auth/login");
            showToast(response.data.message, "success");
          } else {
            setHasErrors(true);
          }
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
        <title>{APP_NAME} | Auth | Update Password</title>
      </Helmet>
      <form
        className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
        noValidate
        id="kt_login_password_reset_form"
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-10">
          {/* begin::Title */}
          <h1 className="text-dark fw-bolder mb-3">Update Password</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className="text-gray-500 fw-semibold fs-6">
            Enter new password for your account.
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

        {/* begin::Form group */}
        <div className="fv-row mb-8">
          <input
            type="password"
            placeholder="Enter new password"
            autoComplete="off"
            {...formik.getFieldProps("password")}
            className={clsx(
              "form-control bg-transparent",
              {
                "is-invalid": formik.touched.password && formik.errors.password,
              },
              {
                "is-valid": formik.touched.password && !formik.errors.password,
              }
            )}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.password}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className="fv-row mb-8">
          <input
            type="password"
            placeholder="Confirm new password"
            autoComplete="off"
            {...formik.getFieldProps("cfmPassword")}
            className={clsx(
              "form-control bg-transparent",
              {
                "is-invalid":
                  formik.touched.cfmPassword && formik.errors.cfmPassword,
              },
              {
                "is-valid":
                  formik.touched.cfmPassword && !formik.errors.cfmPassword,
              }
            )}
          />
          {formik.touched.cfmPassword && formik.errors.cfmPassword && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.cfmPassword}</span>
              </div>
            </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className="d-flex flex-wrap justify-content-center pb-lg-0">
          <LoadingButton
            btnText="Submit"
            loading={loading}
            loadingText={"Please wait..."}
            btnClass={"btn btn-primary me-4"}
            disableBtn={formik.isSubmitting || !formik.isValid || loading}
          />
          <Link to="/agent/auth/login">
            <button
              type="button"
              id="kt_login_password_reset_form_cancel_button"
              className="btn btn-light"
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
