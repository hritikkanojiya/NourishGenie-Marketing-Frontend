/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { Option } from "../../../common/globals/common.model";
import { ModalComponent } from "../../../common/components/modal/Modal";
import { LoadingButton } from "../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../common/toastify/toastify.config";
import { AppAgentService } from "../services/app_agent.service";
import { AccessGroupService } from "../../permissions/services/access_group.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const registerAgentSchema = Yup.object().shape({
  username: Yup.string().trim().required("Username is required"),
  email: Yup.string().email().trim().required("email is required"),
  password: Yup.string()
    .trim()
    .min(8, "Minimum 8 characters")
    .max(16, "Maximum 16 characters")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,}/,
      "Password should have atleast one uppercase, lowercase and a special character and should be atleast 8 characters long"
    )
    .required("Password is required"),
  appAccessGroupId: Yup.string().trim().required("Access group is required"),
});

let initialValues = {
  username: "",
  email: "",
  password: "",
  appAccessGroupId: "",
};

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

export const AppAgentModal: FC<Props> = ({ showModal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [selectState, setSelectState] = useState<{ appAccessGroup: Option }>({
    appAccessGroup: { label: "", value: null },
  });
  const [accessGroupOptions, setAccessGroupOptions] = useState<any>();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: registerAgentSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const request = await AppAgentService.registerAgent(values);
      if ("data" in request) {
        showToast(request.data.message, "success");
        closeModal();
      }
      setLoading(false);
    },
  });

  const getAccessGroupIds = async () => {
    const request = await AccessGroupService.getAccessGroup({
      metaData: { fields: ["appAccessGroupId", "name"], limit: -1 },
    });
    if ("data" in request) {
      const groupOptions = request.data.appAccessGroups?.map((group) => {
        return { label: group.name, value: group.appAccessGroupId };
      });
      setAccessGroupOptions(groupOptions);
    }
  };

  useEffect(() => {
    getAccessGroupIds();
  }, []);

  useEffect(() => {
    formik.resetForm();
    initialValues = {
      appAccessGroupId: "",
      email: "",
      password: "",
      username: "",
    };
    setSelectState({ appAccessGroup: { label: "", value: null } });
  }, [showModal]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | Agents | Create Agent</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Create Agent"}
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Username</span>
            </label>
            <input
              type="text"
              {...formik.getFieldProps("username")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.username && formik.errors.username,
                },
                {
                  "is-valid":
                    formik.touched.username && !formik.errors.username,
                }
              )}
              placeholder="Enter username"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.username}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Email</span>
            </label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control bg-transparent py-2",
                { "is-invalid": formik.touched.email && formik.errors.email },
                {
                  "is-valid": formik.touched.email && !formik.errors.email,
                }
              )}
              placeholder="Enter email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.email}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Password</span>
            </label>
            <input
              type="password"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control bg-transparent py-2",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                },
                {
                  "is-valid":
                    formik.touched.password && !formik.errors.password,
                }
              )}
              placeholder="Enter password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.password}</span>
              </div>
            )}
          </div>
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx("required")}>Access Group</span>
            </label>
            <Select
              className={clsx(
                "is-invalid",
                {
                  "is-invalid":
                    formik.touched.appAccessGroupId &&
                    formik.errors.appAccessGroupId,
                },
                {
                  "is-valid":
                    formik.touched.appAccessGroupId &&
                    !formik.errors.appAccessGroupId,
                }
              )}
              options={accessGroupOptions}
              isMulti={false}
              menuPosition="fixed"
              onChange={(option) => {
                formik.setFieldValue(
                  "appAccessGroupId",
                  option ? option.value : null
                );
                const label = option?.label || "";
                const value = option?.value;
                setSelectState({ appAccessGroup: { label, value } });
              }}
              value={selectState.appAccessGroup}
            />
            {formik.touched.appAccessGroupId && formik.errors.appAccessGroupId && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.appAccessGroupId}</span>
              </div>
            )}
          </div>
          <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10 pt-5">
            <LoadingButton
              btnText={"Register"}
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
        </form>
      </ModalComponent>
    </>
  );
};
