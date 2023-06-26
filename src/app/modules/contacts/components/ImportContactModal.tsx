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
import { AppContactService } from "../services/app_contact.service";
import { ImportContactsPayload } from "../models/app_contacts.model";
import { AppListService } from "../../lists/services/app_list.service";
import { AppDataSourceService } from "../../data_migration/services/data_sources/app_dataSource.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const createAppConstantSchema = Yup.object().shape({
  appDataSourceId: Yup.string()
    .trim()
    .required("App datasource ID is required."),
  appListId: Yup.string().trim().required("App List ID is required"),
});

let initialValues: ImportContactsPayload = {
  appDataSourceId: "",
  appListId: "",
};

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

export const ImportContactModal: FC<Props> = ({ showModal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [selectState, setSelectState] = useState<{
    listId: Option;
    dataSourceId: Option;
  }>({
    listId: { label: "Choose One", value: null },
    dataSourceId: { label: "Choose One", value: null },
  });
  const [optionState, setOptionState] = useState<{
    dataSourceOptions: Option[];
    listOptions: Option[];
  }>({ dataSourceOptions: [], listOptions: [] });

  const getDataSourceIds = async () => {
    const request = await AppDataSourceService.getDataSource({
      metaData: { fields: ["name", "appDataSourceId"] },
    });
    if ("data" in request) {
      const options = request.data.appDataSources?.map((dataSource) => {
        return { label: dataSource.name, value: dataSource.appDataSourceId };
      });
      setOptionState((prevState) => {
        return { ...prevState, dataSourceOptions: options };
      });
    }
  };

  const getListIds = async () => {
    const request = await AppListService.getAppLists();
    if ("data" in request) {
      const options = request.data.appLists?.map((list) => {
        return { label: list.name, value: list.appListId };
      });
      setOptionState((prevState) => {
        return { ...prevState, listOptions: options };
      });
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createAppConstantSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const request = await AppContactService.importContact({
        appDataSourceId: values.appDataSourceId,
        appListId: values.appListId,
      });
      if ("data" in request) {
        showToast(request.data.message, "success");
        closeModal();
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    getDataSourceIds();
    getListIds();
  }, []);

  useEffect(() => {
    formik.resetForm();
    setSelectState({
      dataSourceId: { label: "Choose One", value: null },
      listId: { label: "Choose One", value: null },
    });
  }, [showModal]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | Contacts | Import Contacts</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Import Contacts"}
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>DataSource</span>
              </label>
              <Select
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appDataSourceId &&
                      formik.errors.appDataSourceId,
                  },
                  {
                    "is-valid":
                      formik.touched.appDataSourceId &&
                      !formik.errors.appDataSourceId,
                  }
                )}
                options={optionState.dataSourceOptions}
                isMulti={false}
                menuPosition="fixed"
                onChange={(option) => {
                  formik.setFieldValue(
                    "appDataSourceId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, dataSourceId: { label, value } };
                  });
                }}
                value={selectState.dataSourceId}
              />
              {formik.touched.appDataSourceId && formik.errors.appDataSourceId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.appDataSourceId}</span>
                </div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>List Id</span>
              </label>
              <Select
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appListId && formik.errors.appListId,
                  },
                  {
                    "is-valid":
                      formik.touched.appListId && !formik.errors.appListId,
                  }
                )}
                options={optionState.listOptions}
                isMulti={false}
                menuPosition="fixed"
                onChange={(option) => {
                  formik.setFieldValue(
                    "appListId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, listId: { label, value } };
                  });
                }}
                value={selectState.listId}
              />
              {formik.touched.appListId && formik.errors.appListId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.appListId}</span>
                </div>
              )}
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10 pt-5">
            <LoadingButton
              btnText={"Submit"}
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
