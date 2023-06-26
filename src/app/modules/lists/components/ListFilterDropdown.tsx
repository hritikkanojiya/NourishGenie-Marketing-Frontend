import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { Option } from "../../../common/globals/common.model";
import Select from "react-select";
import { AppListService } from "../services/app_list.service";
import { GetAppListOptions } from "../models/app_list.model";

const initialValues: GetAppListOptions = {
  appListId: null,
  name: null,
  search: null,
  sendInBlue: {
    sendInBlueFolderId: null,
    sendInBlueListId: null,
  },
  page: 1,
};

type Props = {
  setFilterOptions: any;
};

export const ListFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [constantOption, setConstantOptions] = useState<any>([]);
  const [selectState, setSelectState] = useState<{ appListId: Option }>({
    appListId: { label: "Choose One", value: null },
  });

  const getAppListIds = async () => {
    const request = await AppListService.getAppLists({
      metaData: { fields: ["appListId", "name"], limit: -1 },
    });
    if ("data" in request) {
      const appConstant = request.data.appLists;
      setConstantOptions(
        appConstant?.map((list) => {
          return { value: list.appListId, label: list.name };
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
      appListId: null,
      name: null,
      search: null,
      sendInBlue: {
        sendInBlueFolderId: null,
        sendInBlueListId: null,
      },
      page: formik.values.page,
    });
    formik.setFieldValue("appListId", null);
    setSelectState({
      appListId: {
        label: "Choose One",
        value: null,
      },
    });
    formik.resetForm();
  };

  useEffect(() => {
    getAppListIds();
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
                type="number"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Page"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.page || ""}
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">App List Id</label>
            <Select
              isClearable={true}
              isMulti={false}
              backspaceRemovesValue={true}
              onChange={(option) => {
                formik.setFieldValue("appListId", option?.value || "");
                setSelectState((prevState) => {
                  return {
                    ...prevState,
                    appListId: {
                      label: option?.label || "",
                      value: option?.value || "",
                    },
                  };
                });
              }}
              value={selectState.appListId}
              options={constantOption}
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">SendInBlue Folder Id :</label>
            <div className="position-relative">
              <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
              <input
                {...formik.getFieldProps("sendInBlue.sendInBlueFolderId")}
                type="text"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="Folder Id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sendInBlue?.sendInBlueFolderId || ""}
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="form-label fw-bold">SendInBlue List Id :</label>
            <div className="position-relative">
              <i className="fa fa-search fs-5 text-gray-400 position-absolute top-50 translate-middle ms-6"></i>
              <input
                {...formik.getFieldProps("sendInBlue.sendInBlueListId")}
                type="text"
                className="form-control bg-transparent py-2 ps-10"
                placeholder="List Id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.sendInBlue?.sendInBlueListId || ""}
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
  );
};
