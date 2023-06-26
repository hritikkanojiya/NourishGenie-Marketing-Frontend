import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { AccessGroupService } from "../../services/access_group.service";
import { Option } from "../../../../common/globals/common.model";
import { ServiceRouteService } from "../../services/service_route.service";
import { methodOptions } from "../../../../common/globals/common.constants";
import { useFormik } from "formik";
import { GetRouteOptions } from "../../models/service_route.model";

const initialValues: GetRouteOptions = {
  appRouteId: null,
  method: null,
  secure: null,
  appAccessGroupIds: [],
  search: undefined,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const RouteFilterDropDown: FC<Props> = ({ setFilterOptions }) => {
  const [accessGroupOptions, setAccessGroupOptions] = useState<any>([]);
  const [, setRouteIdOptions] = useState<Option[]>([]);

  const [selectState, setSelectState] = useState<{
    appRouteId: Option;
    appAccessGroupIds: Option[];
    method: Option;
  }>({
    appRouteId: {
      label: "Choose One",
      value: null,
    },
    appAccessGroupIds: [],
    method: {
      label: "Choose One",
      value: null,
    },
  });

  const getAccessGroups = async () => {
    const request = await AccessGroupService.getAccessGroup({
      metaData: { fields: ["appAccessGroupId", "name"], limit: -1 },
    });
    if ("data" in request) {
      const accessGroups = request.data.appAccessGroups;
      setAccessGroupOptions(
        accessGroups?.map((group) => {
          return { value: group.appAccessGroupId, label: group.name };
        })
      );
    }
  };

  const getAppRouteIds = async () => {
    const request = await ServiceRouteService.getServiceRoutes({
      metaData: { fields: ["path", "appRouteId"], limit: -1 },
    });
    if ("data" in request) {
      const serviceRoutes = request.data.appRoutes;
      setRouteIdOptions(
        serviceRoutes?.map((route) => {
          return {
            value: route.appRouteId ? route.appRouteId : "",
            label: route.path,
          };
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setFilterOptions(values);
    },
  });

  const resetForm = () => {
    setFilterOptions({
      appRouteId: null,
      method: null,
      secure: null,
      appAccessGroupIds: [],
      search: null,
      page: formik.values.page,
    });
    formik.setFieldValue("appRouteId", null);
    formik.setFieldValue("appAccessGroupIds", null);
    formik.setFieldValue("method", null);
    setSelectState({
      appAccessGroupIds: [],
      appRouteId: { label: "", value: null },
      method: { label: "Choose One", value: null },
    });
    formik.resetForm();
  };

  const clearSecure = () => formik.setFieldValue("secure", null);

  useEffect(() => {
    getAccessGroups();
    getAppRouteIds();
  }, []);

  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
      data-kt-menu="true"
    >
      <div className="px-7 py-5">
        <div className="fs-5 text-dark fw-bolder">Filter Options</div>
      </div>
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="separator border-gray-200"></div>
        <div className="px-7 py-5 pb-0">
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bold text-dark">Search</label>
            <div className="position-relative">
              <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
              <input
                {...formik.getFieldProps("search")}
                type="text"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Search"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.search || ""}
              />
            </div>
            <small className="form-text text-muted">
              <b>Search</b> in path
            </small>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bold text-dark">Page</label>
            <div className="position-relative">
              <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
              <input
                {...formik.getFieldProps("page")}
                type="number"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Search"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.page || ""}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Access Groups</label>
            <Select
              isClearable={true}
              isMulti={true}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue(
                  "appAccessGroupIds",
                  option?.map((opt) => opt.value) || []
                );
                setSelectState((previousState) => {
                  return {
                    ...previousState,
                    appAccessGroupIds: option?.map((opt) => {
                      return { label: opt.label || "", value: opt.label || "" };
                    }),
                  };
                });
              }}
              value={selectState.appAccessGroupIds}
              options={accessGroupOptions}
            />
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Methods</label>
            <Select
              isClearable={true}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue(
                  "method",
                  option?.value ? option.value : null
                );
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    method: {
                      label: option?.label || "",
                      value: option?.value,
                    },
                  };
                });
              }}
              // menuPosition=""
              options={methodOptions}
              value={selectState.method}
            />
          </div>
          <div className="fv-row row mb-5">
            <label className="form-label fw-bold">Secure</label>
            <div className="col-5">
              <div data-kt-buttons="true">
                <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-success w-100">
                  <div className="d-flex align-items-center justify-content-evenly">
                    <div className="form-check form-check-custom form-check-solid form-check-success pe-1">
                      <input
                        className="form-check-input w-15px h-15px"
                        type="radio"
                        {...formik.getFieldProps("secure")}
                        value={true.toString()}
                        checked={formik.values.secure === "true"}
                      />
                    </div>
                    <div className="fw-bold">Yes</div>
                  </div>
                </label>
              </div>
            </div>
            <div className="col-5">
              <div data-kt-buttons="true">
                <label className="btn btn-sm btn-outline btn-outline-dashed btn-outline-danger w-100">
                  <div className="d-flex align-items-center justify-content-evenly">
                    <div className="form-check form-check-custom form-check-solid form-check-danger pe-1">
                      <input
                        className="form-check-input w-15px h-15px"
                        type="radio"
                        {...formik.getFieldProps("secure")}
                        checked={formik.values.secure === "false"}
                        value={false.toString()}
                      />
                    </div>
                    <div className="fw-bold">No</div>
                  </div>
                </label>
              </div>
            </div>
            <div className="col-2 m-auto">
              <label
                onClick={clearSecure}
                className="btn btn-outline btn-outline-dashed btn-outline-dark p-3"
              >
                <div className="d-flex align-items-center justify-content-center">
                  <i className="fa-solid fa-xmark"></i>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="separator border-gray-200"></div>
        <div className="py-5 d-flex justify-content-evenly">
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            data-kt-menu-dismiss="true"
          >
            Apply
          </button>
          <button
            type="button"
            className="btn btn-sm btn-light"
            data-kt-menu-dismiss="true"
            onClick={resetForm}
            onReset={formik.handleReset}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
