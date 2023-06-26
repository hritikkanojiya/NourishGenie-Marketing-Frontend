/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { ListsWidget5 } from "../../../../_metronic/partials/widgets/lists/ListsWidget5";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import { Helmet } from "react-helmet";
import clsx from "clsx";
import { AppActivity, AppAgent } from "../../agents/models/app_agent.model";
import { AuthService } from "../../auth/services/auth.service";
import { showToast } from "../../../common/toastify/toastify.config";
import { AppAgentService } from "../../agents/services/app_agent.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const updateAgentDetailsSchema = Yup.object().shape({
  username: Yup.string().trim().required("Name is required"),
  email: Yup.string().trim().required("Value is required"),
});

export function Overview() {
  // const [loading, setLoading] = useState(false)
  const { currentUser, agent, setAgent } = useAuth();
  const [agentId, setAgentId] = useState("");
  const navigate = useNavigate();
  const params: any = useParams();
  const [agentActivities, setAgentActivities] = useState<AppActivity[]>([]);

  let initialValues: AppAgent = {
    appAgentId: agent?.appAgentId || "",
    email: agent?.email || "",
    username: agent?.username || "sd",
    appAccessGroup: {
      appAccessGroupId: agent?.appAccessGroup?.appAccessGroupId || "",
      name: agent?.appAccessGroup?.name || "",
      description: agent?.appAccessGroup?.description || "",
      isAdministrator: agent?.appAccessGroup?.isAdministrator || false,
    },
    appAccessGroupId: agent?.appAccessGroupId || "",
    password: "",
  };

  const verifyAuth = async () => {
    const isAdmin = await AuthService.currentUserIsAdmin();
    if (agentId) {
      const isCurrentUser = agentId === currentUser?.appAgentId;
      if (isAdmin || isCurrentUser) {
        return;
      } else {
        showToast("Request not authorized [overview]", "error");
        navigate(`/dashboard`);
      }
    }
  };

  const getAgent = async () => {
    if (agentId) {
      const request = await AppAgentService.getAgentDetails(agentId);
      if ("data" in request) {
        setAgent(request.data.appAgentAccDetails);
      }
    }
  };

  const getAgentActivities = async () => {
    if (agentId) {
      const request = await AppAgentService.getAppActivities({
        appAgentId: agentId,
      });
      if ("data" in request) {
        setAgentActivities(request.data.appActivities);
      }
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: updateAgentDetailsSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      // setLoading(true)
    },
  });

  useEffect(() => {
    setAgentId(params.appAgentId);
  }, [params.appAgentId]);

  useEffect(() => {
    verifyAuth();
    getAgent();
    getAgentActivities();
  }, [agentId]);

  return (
    <>
      <Helmet>
        <title>
          {APP_NAME} | {agent?.username || ""} | Overview
        </title>
      </Helmet>
      <div className="row gy-10 gx-xl-10">
        <div className="col-xl-6">
          <div className="card mb-5 mb-xl-10" id="kt_profile_details_view">
            <div className="card-header cursor-pointer">
              <div className="card-title m-0">
                <h3 className="fw-bolder m-0">Profile Details</h3>
              </div>
              <Link to="/" className="btn btn-primary align-self-center">
                Edit Profile
              </Link>
            </div>
            <div className="card-body p-9">
              <form
                onSubmit={formik.handleSubmit}
                id="add_service_route_modal_form"
                className="form"
              >
                <div className="row mb-7">
                  <label className="col-lg-4 form-label fw-bold text-muted">
                    <span className={clsx()}>Username</span>
                  </label>
                  <div className="col-lg-8">
                    <input
                      disabled={true}
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
                      placeholder="Username"
                    />
                    {formik.touched.username && formik.errors.username && (
                      <div className="fv-plugins-message-container text-danger">
                        <span role="alert">{formik.errors.username}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-7">
                  <label className="col-lg-4 form-label fw-bold text-muted">
                    <span className={clsx()}>Email</span>
                  </label>
                  <div className="col-lg-8">
                    <input
                      disabled={true}
                      type="text"
                      {...formik.getFieldProps("email")}
                      className={clsx(
                        "form-control bg-transparent py-2",
                        {
                          "is-invalid":
                            formik.touched.email && formik.errors.email,
                        },
                        {
                          "is-valid":
                            formik.touched.email && !formik.errors.email,
                        }
                      )}
                      placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="fv-plugins-message-container text-danger">
                        <span role="alert">{formik.errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-7">
                  <label className="col-lg-4 form-label fw-bold text-muted">
                    <span className={clsx()}>Access Group</span>
                  </label>
                  <div className="col-lg-8">
                    <input
                      disabled
                      type="text"
                      className="form-control bg-transparent py-2"
                      placeholder="Access Group"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <ListsWidget5
            agentActivities={agentActivities}
            className="card-xxl-stretch mb-5 mb-xl-10"
          />
        </div>
      </div>
    </>
  );
}
