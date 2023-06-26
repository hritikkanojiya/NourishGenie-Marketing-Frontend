/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../core/Auth";
import { AuthService } from "../services/auth.service";
import { showToast } from "../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { Helmet } from "react-helmet";
import { APP_NAME } from "../../../common/globals/common.constants";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email")
    .lowercase()
    .trim()
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Minimum 8 characters")
    .max(16, "Maximum 16 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,}/,
      "Password should have atleast one uppercase, lowercase and a special character and should be atleast 8 characters long"
    )
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
};

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        let auth = await AuthService.login(values.email, values.password);
        if ("data" in auth && auth.data.appAgentAccDetails) {
          setCurrentUser(auth.data.appAgentAccDetails);
          showToast("Logged In", "success");
          const next = searchParams.get("next");
          if (next) {
            const to: any = encodeURI(next);
            navigate(to);
          }
        } else {
          setCurrentUser(undefined);
          setSubmitting(false);
          setLoading(false);
        }
      } catch (error: any) {
        setCurrentUser(undefined);
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Helmet>
        <title>{APP_NAME} | Auth | Login</title>
      </Helmet>
      <form
        className="form w-100"
        id="kt_sign_in_form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-11">
          <h1 className="text-dark fw-bolder mb-3">Sign In</h1>

          <div className="text-gray-500 fw-semibold fs-6">
            To your marketing account
          </div>
        </div>
        <div className="fv-row mb-8">
          <input
            placeholder="Email"
            {...formik.getFieldProps("email")}
            className={clsx(
              "form-control bg-transparent",
              { "is-invalid": formik.touched.email && formik.errors.email },
              {
                "is-valid": formik.touched.email && !formik.errors.email,
              }
            )}
            type="email"
            name="email"
            autoComplete="off"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.email}</span>
              </div>
            </div>
          )}
        </div>
        <div className="fv-row mb-3">
          <input
            placeholder="Password"
            type="password"
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
        <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
          <div></div>
          <Link
            to="/agent/auth/forgot-password"
            className="link-primary"
            state={{ email: formik.values.email }}
          >
            Forgot Password ?
          </Link>
        </div>
        <LoadingButton
          btnText="Login"
          loading={loading}
          disableBtn={formik.isSubmitting || !formik.isValid || loading}
        />
      </form>
    </>
  );
}
