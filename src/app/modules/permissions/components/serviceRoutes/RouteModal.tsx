/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import Select from "react-select";
import { AccessGroupService } from "../../services/access_group.service";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  APP_NAME,
  methodOptions,
  methods,
} from "../../../../common/globals/common.constants";
import clsx from "clsx";
import { ServiceRouteService } from "../../services/service_route.service";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { ServiceRoute } from "../../models/service_route.model";
import { Option } from "../../../../common/globals/common.model";

const createServiceRouteSchema = Yup.object().shape({
  method: Yup.string().oneOf(methods).required("Method is required"),
  path: Yup.string()
    .matches(/^\/[a-zA-Z0-9]+[^\s]*$/, "Route path must be a valid URL")
    .required("Route path is required"),
  secure: Yup.boolean().required("Secure flag is required"),
  appAccessGroupIds: Yup.array().when("secure", {
    is: (val: boolean) => val !== false,
    then: Yup.array()
      .of(Yup.string())
      .min(1)
      .required("Min one access group is required"),
  }),
});

const updateServiceRouteSchema = Yup.object().shape({
  method: Yup.string().oneOf(methods),
  path: Yup.string().trim(),
  secure: Yup.string().oneOf(["true", "false"]).required("Secure is required"),
  appAccessGroupIds: Yup.array().when("secure", {
    is: (val: boolean | string) => val === true || val === "true",
    then: Yup.array()
      .of(Yup.string())
      .min(1)
      .required("Min one access group is required"),
  }),
});

let initialValues: ServiceRoute = {
  method: null,
  path: "",
  secure: false,
  appAccessGroupIds: [],
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  routeDetails?: ServiceRoute | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  routeDetails?: ServiceRoute | {};
};

export const ServiceRouteModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  routeDetails,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    routeDetails: undefined,
  });

  const [selectState, setSelectState] = useState<{
    secure: Option;
    appAccessGroupIds: Option[];
    method: Option;
  }>({
    secure: { label: "", value: null },
    appAccessGroupIds: [],
    method: { label: "Choose One", value: null },
  });

  const getAccessGroups = async () => {
    const request = await AccessGroupService.getAccessGroup({
      metaData: { fields: ["appAccessGroupId", "name"] },
    });
    if ("data" in request) {
      const accessGroups = request.data.appAccessGroups;
      setAccessGroupOptions(
        accessGroups?.map((group) => {
          return { value: group.appAccessGroupId || "", label: group.name };
        })
      );
    }
  };

  const [accessGroupOptions, setAccessGroupOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: state.editMode
      ? updateServiceRouteSchema
      : createServiceRouteSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const routeDetails: any = {
        path: values.path,
        secure: values.secure,
        appAccessGroupIds: values.appAccessGroupIds,
        method: values.method,
      };
      if (!state.editMode) {
        const request = await ServiceRouteService.createServiceRoute(
          routeDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.routeDetails && "path" in state.routeDetails) {
          routeDetails.appRouteId = state.routeDetails?.appRouteId;
          const request = await ServiceRouteService.updateServiceRoute(
            routeDetails
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
    getAccessGroups();
    setState((prevState) => {
      return {
        ...prevState,
        editMode: editMode,
        readOnlyMode: readOnlyMode,
        showModal: showModal,
      };
    });
    formik.resetForm();
    if ((editMode || readOnlyMode) && routeDetails) {
      if ("appRouteId" in routeDetails) {
        setState((prevState) => {
          return { ...prevState, routeDetails: routeDetails };
        });
        initialValues = {
          appAccessGroupIds: routeDetails?.appAccessGroupIds,
          method: routeDetails?.method,
          path: routeDetails?.path,
          secure: routeDetails?.secure.toString(),
          appRouteId: routeDetails?.appRouteId,
        };
        const accessGroupValues: any[] = [];
        accessGroupOptions.forEach((option) => {
          if (routeDetails?.appAccessGroupIds?.includes(option.value)) {
            accessGroupValues.push({
              label: option.label,
              value: option.value,
            });
          }
        });
        setSelectState({
          appAccessGroupIds: accessGroupValues,
          secure: {
            label: routeDetails?.secure ? "Yes" : "No",
            value: routeDetails?.secure,
          },
          method: {
            label: routeDetails.method || "",
            value: routeDetails.method,
          },
        });
      }
    } else {
      initialValues = {
        appAccessGroupIds: [],
        method: null,
        path: "",
        secure: false,
      };
      setSelectState({
        appAccessGroupIds: [],
        method: { label: "Choose One", value: null },
        secure: { label: "", value: null },
      });
    }
  }, [showModal, editMode, readOnlyMode, routeDetails]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Service Routes
            {showModal
              ? ` | ${
                  state.readOnlyMode
                    ? "Read"
                    : state.editMode
                    ? `Update`
                    : `Create`
                } Service Route`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode
            ? "Read Service Route"
            : state.editMode
            ? "Update Service Route"
            : "Create Service Route"
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
              <span className={clsx({ required: !state.editMode })}>
                Route Path
              </span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("path")}
              className={clsx(
                "form-control bg-transparent py-2",
                { "is-invalid": formik.touched.path && formik.errors.path },
                {
                  "is-valid": formik.touched.path && !formik.errors.path,
                }
              )}
              placeholder="Enter a route path"
            />
            {formik.touched.path && formik.errors.path && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.path}</span>
              </div>
            )}
          </div>
          {(formik.values.secure === "true" ||
            formik.values.secure === true) && (
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>Access Groups</span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  {
                    "is-invalid":
                      formik.touched.appAccessGroupIds &&
                      formik.errors.appAccessGroupIds,
                  },
                  {
                    "is-valid":
                      formik.touched.appAccessGroupIds &&
                      !formik.errors.appAccessGroupIds,
                  }
                )}
                backspaceRemovesValue={true}
                onChange={(options) => {
                  let selectedValues: any = options?.map((option) => {
                    return option.value;
                  });
                  formik.setFieldValue(
                    "appAccessGroupIds",
                    selectedValues || []
                  );
                  selectedValues = options?.map((option) => {
                    return { label: option.label, value: option.value };
                  });
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      appAccessGroupIds: selectedValues || [],
                    };
                  });
                }}
                value={selectState.appAccessGroupIds}
                options={accessGroupOptions}
                onBlur={formik.handleBlur}
                isMulti={true}
                placeholder={"Access Groups"}
              />
              {formik.touched.appAccessGroupIds &&
                formik.errors.appAccessGroupIds && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">{formik.errors.appAccessGroupIds}</span>
                  </div>
                )}
            </div>
          )}
          <div className="fv-row row">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                Secure
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
                            {...formik.getFieldProps("secure")}
                            value={"true"}
                            checked={formik.values.secure === "true"}
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
                            {...formik.getFieldProps("secure")}
                            value={"false"}
                            checked={formik.values.secure === "false"}
                          />
                        </div>
                        <div className="fw-bold">No</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {formik.touched.secure && formik.errors.secure && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.secure}</span>
                </div>
              )}
              {formik.values.secure === true && !readOnlyMode && (
                <div className="fv-plugins-message-container text-info">
                  <span role="alert" className="text-danger">
                    Min 1 access group is required
                  </span>
                </div>
              )}
            </div>

            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={clsx({ required: !state.editMode })}>
                  Method
                </span>
              </label>
              <Select
                isDisabled={state.readOnlyMode}
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid": formik.touched.method && formik.errors.method,
                  },
                  {
                    "is-valid": formik.touched.method && !formik.errors.method,
                  }
                )}
                options={methodOptions}
                isMulti={false}
                menuPosition="fixed"
                onChange={(option) => {
                  formik.setFieldValue("method", option ? option.value : null);
                  setSelectState((prevState) => {
                    return {
                      ...prevState,
                      method: { label: option?.value, value: option?.value },
                    };
                  });
                }}
                value={selectState.method}
                placeholder={"Route Method"}
              />
              {formik.touched.method && formik.errors.method && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.method}</span>
                </div>
              )}
            </div>
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
