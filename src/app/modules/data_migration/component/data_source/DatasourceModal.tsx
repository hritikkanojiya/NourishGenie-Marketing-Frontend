/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { showToast } from "../../../../common/toastify/toastify.config";
import { AppDataSource } from "../../models/data_sources/app_datasource.model";
import { AppDataSourceService } from "../../services/data_sources/app_dataSource.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createAppDataSourceSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim().required("Description is required"),
  sql_query: Yup.string().trim().required("SQL Query is required"),
  fields: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().trim().required("Field name is required"),
      isEncrypted: Yup.boolean(),
    })
  ),
});

let initialValues: AppDataSource = {
  name: "",
  description: "",
  fields: [],
  sql_query: "",
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  dataSource?: AppDataSource | {};
  closeModal: () => void;
};

type RouteOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  dataSource?: AppDataSource | {};
};

export const AppDataSourceModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  dataSource,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    dataSource: undefined,
  });
  const [canExecuteQuery, setCanExecuteQuery] = useState(true);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createAppDataSourceSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const dataSourceDetails: any = {
        name: values.name,
        description: values.description,
        sql_query: values.sql_query,
        fields: values.fields,
      };
      if (!state.editMode) {
        const request = await AppDataSourceService.createDataSource(
          dataSourceDetails
        );
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.dataSource && "name" in state.dataSource) {
          dataSourceDetails.appDataSourceId =
            state.dataSource.appDataSourceId || "";
          const request = await AppDataSourceService.updateDataSource(
            dataSourceDetails
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

  const executeQuery = async () => {
    const query = formik.values.sql_query;
    if (!query) {
      showToast("Kindly provide an SQL query for execution.", "warning");
      return;
    }
    try {
      const request = await AppDataSourceService.getDataSourceFields({
        checkOn: "Query",
        query: query,
      });
      if ("data" in request) {
        if ("message" in request.data) {
          const fields = request.data.fields;
          if (fields?.length) {
            formik.setFieldValue("fields", fields);
          }
          setCanExecuteQuery(false);
        } else {
          setCanExecuteQuery(true);
        }
      } else {
      }
    } catch (err) {
      setCanExecuteQuery(true);
    }
  };

  const onToggleIsEncrypted = (index: number) => {
    formik.setFieldValue(
      `fields.${index}.isEncrypted`,
      !formik.values.fields[index].isEncrypted
    );
  };

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        editMode: editMode,
        readOnlyMode: readOnlyMode,
        showModal: showModal,
      };
    });
    formik.resetForm();
    if ((editMode || readOnlyMode) && dataSource) {
      if ("name" in dataSource) {
        setState((prevState) => {
          return { ...prevState, dataSource: dataSource };
        });
        const fields = dataSource.fields?.map((field) => {
          return { name: field.name, isEncrypted: field.isEncrypted };
        });
        initialValues = {
          name: dataSource.name,
          description: dataSource.description,
          sql_query: dataSource.sql_query,
          fields: fields,
        };
        setCanExecuteQuery(false);
      }
    } else {
      initialValues = {
        name: "",
        description: "",
        sql_query: "",
        fields: [],
      };
    }
  }, [showModal, editMode, readOnlyMode, dataSource]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Data Sources
            {showModal
              ? ` | ${state.readOnlyMode && dataSource
                ? initialValues.name
                : state.editMode
                  ? `Update Data Source`
                  : `Create Data Source`
              }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          readOnlyMode && dataSource
            ? initialValues.name
            : state.editMode
              ? "Update Data Source"
              : "Create Data Source"
        }
        id="addDataSource"
        modalSize={"modal-lg"}
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>Name</span>
            </label>
            <input
              disabled={state.readOnlyMode}
              type="text"
              {...formik.getFieldProps("name")}
              className={clsx(
                "form-control bg-transparent py-2",
                { "is-invalid": formik.touched.name && formik.errors.name },
                {
                  "is-valid": formik.touched.name && !formik.errors.name,
                }
              )}
              placeholder="Enter data source name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Description
              </span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("description")}
              rows={5}
              placeholder="Description"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.description}</span>
              </div>
            )}
          </div>
          <div
            className={clsx("fv-row", {
              "mb-5": formik.values.fields?.length > 0,
            })}
          >
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                SQL Query
              </span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              className="form-control bg-transparent"
              {...formik.getFieldProps("sql_query")}
              rows={5}
              placeholder="SQL Query"
              onChange={(e) => {
                setCanExecuteQuery(true);
                formik.setFieldValue("sql_query", e.target.value);
              }}
            ></textarea>
            {formik.touched.sql_query && formik.errors.sql_query && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.sql_query}</span>
              </div>
            )}
            {!readOnlyMode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={executeQuery}
                  disabled={!canExecuteQuery}
                  className="btn btn-success btn-sm mt-3"
                >
                  Execute Query
                </button>
              </div>
            )}
          </div>
          {formik.values.fields?.length > 0 && (
            <div className="fv-row row">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span>Columns</span>
              </label>
              {formik.values.fields?.map((field, index) => {
                return (
                  <div key={index} className="col-4 mb-3">
                    <div className="d-flex flex-stack p-3 border border-dashed border-gray-400 rounded-1">
                      <div className="d-flex align-items-center flex-row-fluid flex-wrap">
                        <div className="flex-grow-1 me-2">
                          <a className="text-gray-800 text-hover-primary fs-6 fw-bold">
                            {field.name}
                          </a>
                        </div>
                        <div className="form-check form-check-solid form-switch fv-row">
                          <input
                            onChange={(event) => onToggleIsEncrypted(index)}
                            disabled={readOnlyMode}
                            className="form-check-input"
                            type="checkbox"
                            id={`${index}`}
                            checked={field.isEncrypted}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!readOnlyMode && (
            <>
              <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10 pt-5">
                <LoadingButton
                  btnText={state.editMode ? "Update" : "Submit"}
                  loading={loading}
                  disableBtn={
                    formik.isSubmitting ||
                    !formik.isValid ||
                    loading ||
                    canExecuteQuery
                  }
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
