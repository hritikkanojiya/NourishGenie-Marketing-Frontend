import { FC, useEffect, useState } from "react";
import { Option } from "../../../../common/globals/common.model";
import { useFormik } from "formik";
import Select from "react-select";
import { AppMenuService } from "../../services/app_menu.service";
import { GetSubMenuOptions } from "../../models/app_sub_menu.model";

const initialValues: GetSubMenuOptions = {
  appMenuId: null,
  search: null,
  appSubMenuId: null,
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const SubMenuFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [appMenuOptions, setAppMenuOptions] = useState<any>([]);
  const [selectState, setSelectState] = useState<{
    appMenuId: Option;
    appSubMenuId: Option;
  }>({
    appMenuId: { label: "Choose One", value: null },
    appSubMenuId: { label: "", value: null },
  });

  const getMenuIds = async () => {
    const request = await AppMenuService.getAppMenus({
      metaData: { fields: ["name", "appMenuId"], limit: -1 },
    });
    if ("data" in request) {
      const appMenus = request.data.appMenus;
      setAppMenuOptions(
        appMenus?.map((menu) => {
          return { label: menu.name, value: menu.appMenuId };
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setFilterOptions(values);
    },
  });

  const resetForm = () => {
    setFilterOptions({
      search: null,
      appMenuId: null,
      appSubMenuId: null,
      page: formik.values.page,
    });
    setSelectState({
      appMenuId: {
        label: "Choose One",
        value: null,
      },
      appSubMenuId: {
        label: "",
        value: null,
      },
    });
    formik.resetForm();
  };

  useEffect(() => {
    getMenuIds();
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
              <b>Search</b> in name, description
            </small>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bold text-dark">Page</label>
            <div className="position-relative">
              <input
                {...formik.getFieldProps("page")}
                type="text"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Search"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.page || ""}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Menu</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("appMenuId", option?.value || "");
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    appMenuId: {
                      label: option?.label || "",
                      value: option?.value || "",
                    },
                  };
                });
              }}
              value={selectState.appMenuId}
              options={appMenuOptions}
            />
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
  );
};
