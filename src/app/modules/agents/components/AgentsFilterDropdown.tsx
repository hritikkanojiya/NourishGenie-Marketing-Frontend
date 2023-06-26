import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Option } from "../../../common/globals/common.model";
import { AccessGroupService } from "../../permissions/services/access_group.service";
import Select from "react-select";

const initialValues = {
  search: "",
  appAccessGroupId: "",
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const AgentFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [accessGroupIdOptions, setAccessGroupIdOptions] = useState<Option[]>(
    []
  );
  const [accessGroupId, setAccessGroupId] = useState<Option>({
    label: "Choose one",
    value: null,
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setFilterOptions(values);
    },
  });

  const resetForm = () => {
    setFilterOptions({
      search: null,
      appAccessGroupId: null,
      page: 1,
    });
    setAccessGroupId({ label: "Choose one", value: null });
    formik.resetForm();
  };

  const getAccessGroupIds = async () => {
    const request = await AccessGroupService.getAccessGroup({
      metaData: { fields: ["name", "appAccessGroupId"] },
    });
    if ("data" in request) {
      const options = request.data.appAccessGroups?.map((group) => {
        return { label: group.name, value: group.appAccessGroupId };
      });
      setAccessGroupIdOptions(options);
    }
  };

  useEffect(() => {
    getAccessGroupIds();
  }, []);

  return (
    <>
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
              <label className="form-label fs-6 fw-bold text-dark">
                Search
              </label>
              <div className="position-relative">
                <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
                <input
                  {...formik.getFieldProps("search")}
                  type="number"
                  className="form-control bg-transparent py-2 ps-10"
                  placeholder="Search"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.search}
                />
              </div>
              <small className="form-text text-muted">
                <b>Search</b> in name, email
              </small>
            </div>
          </div>
          <div className="px-7 py-5 pb-0">
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bold text-dark">Page</label>
              <div className="position-relative">
                <input
                  {...formik.getFieldProps("page")}
                  type="number"
                  className="form-control bg-transparent py-2 ps-10"
                  placeholder="Page"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </div>
          <div className="px-7 py-5 pb-0">
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bold text-dark">
                Access Group
              </label>
              <div className="position-relative">
                <Select
                  isClearable={true}
                  isMulti={false}
                  backspaceRemovesValue={true}
                  onChange={(option) => {
                    formik.setFieldValue(
                      "appAccessGroupId",
                      option?.value || ""
                    );
                    setAccessGroupId({
                      label: option?.label || "",
                      value: option?.value,
                    });
                  }}
                  value={accessGroupId}
                  options={accessGroupIdOptions}
                />
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
              className="btn btn-sm btn-light btn-active-light-primary me-2"
              data-kt-menu-dismiss="true"
              onClick={resetForm}
              onReset={formik.handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
