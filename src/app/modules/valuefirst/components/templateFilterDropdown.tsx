import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import { GetWabaTemplatesOptions } from "../models/wabaTemplate.model";
import { Option } from "../../../common/globals/common.model";
import Select from "react-select";
import { WABASenderService } from "../../waba/services/waba_sender.service";

const initialValues: GetWabaTemplatesOptions = {
  appWABASenderId: null,
  appWABAValueFirstTemplateId: null,
  category: null,
  search: null,
  status: null,
  type: null,
  page: 1,
};

type OptionState = {
  senderIdOptions: Option[];
  categoryOptions: Option[];
  status: Option[];
  type: Option[];
};

type SelectState = {
  senderId: Option;
  category: Option;
  status: Option;
  type: Option;
};

type Props = {
  setFilterOptions: any;
};

export const TemplateFilterDropdown: FC<Props> = ({ setFilterOptions }) => {
  const [optionState, setOptionState] = useState<OptionState>({
    categoryOptions: [],
    senderIdOptions: [],
    status: [],
    type: [],
  });
  const [selectState, setSelectState] = useState<SelectState>({
    category: { label: "Choose One", value: null },
    senderId: { label: "Choose One", value: null },
    status: { label: "Choose One", value: null },
    type: { label: "Choose One", value: null },
  });

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setFilterOptions(values);
    },
  });

  const categoryOptions = [
    { label: "MARKETING", value: "MARKETING" },
    { label: "UTILITY", value: "UTILITY" },
    { label: "AUTHENTICATION", value: "AUTHENTICATION" },
  ];

  const statusOptions = [
    { label: "SUBMITTED", value: "SUBMITTED" },
    { label: "APPROVED", value: "APPROVED" },
    { label: "REJECTED", value: "REJECTED" },
  ];

  const typeOptions = [
    { label: "STANDARD", value: "STANDARD" },
    { label: "MEDIA", value: "MEDIA" },
  ];

  const resetForm = () => {
    setFilterOptions({
      appWABASenderId: null,
      appWABATemplateId: null,
      category: null,
      search: null,
      status: null,
      type: null,
    });
    setSelectState({
      category: { label: "Choose One", value: null },
      senderId: { label: "Choose One", value: null },
      status: { label: "Choose One", value: null },
      type: { label: "Choose One", value: null },
    });
    formik.resetForm();
  };

  const getSenderIds = async () => {
    const request = await WABASenderService.getSenders({
      metaData: { fields: ["name", "appWABASenderId"] },
    });
    if ("data" in request && "message" in request.data) {
      const options = request.data.WABASenders?.map((sender) => {
        return { label: sender.name, value: sender.appWABASenderId };
      });
      setOptionState((prevState) => {
        return { ...prevState, senderIdOptions: options };
      });
    }
  };

  useEffect(() => {
    getSenderIds();
    setOptionState((prevState) => {
      return {
        ...prevState,
        categoryOptions: categoryOptions,
        status: statusOptions,
        type: typeOptions,
      };
    });
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
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">WhatsApp Sender ID</label>
            <div className="position-relative">
              <Select
                isClearable={true}
                isMulti={false}
                backspaceRemovesValue={true}
                onChange={(option) => {
                  formik.setFieldValue("appWABASenderId", option?.value);
                  setSelectState((previousState) => {
                    return {
                      ...previousState,
                      senderId: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.senderId}
                options={optionState.senderIdOptions}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Category</label>
            <div className="position-relative">
              <Select
                isClearable={true}
                isMulti={false}
                backspaceRemovesValue={true}
                onChange={(option) => {
                  formik.setFieldValue("category", option?.value);
                  setSelectState((previousState) => {
                    return {
                      ...previousState,
                      category: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.category}
                options={optionState.categoryOptions}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Status</label>
            <div className="position-relative">
              <Select
                isClearable={true}
                isMulti={false}
                backspaceRemovesValue={true}
                onChange={(option) => {
                  formik.setFieldValue("status", option?.value);
                  setSelectState((previousState) => {
                    return {
                      ...previousState,
                      status: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.status}
                options={optionState.status}
              />
            </div>
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fw-bold">Type</label>
            <div className="position-relative">
              <Select
                isClearable={true}
                isMulti={false}
                backspaceRemovesValue={true}
                onChange={(option) => {
                  formik.setFieldValue("type", option?.value);
                  setSelectState((previousState) => {
                    return {
                      ...previousState,
                      type: {
                        label: option?.label || "",
                        value: option?.value,
                      },
                    };
                  });
                }}
                value={selectState.type}
                options={optionState.type}
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
