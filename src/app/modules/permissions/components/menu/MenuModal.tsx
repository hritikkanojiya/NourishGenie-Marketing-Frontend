/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import Select from "react-select";
import { AccessGroupService } from "../../services/access_group.service";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { Option } from "../../../../common/globals/common.model";
import { AppMenuModel } from "../../models/app_menu.model";
import { AppMenuService } from "../../services/app_menu.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createMenuSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required."),
  description: Yup.string().trim().required("Description is required."),
  hasSubMenus: Yup.boolean().required("Value for has sub-menus is required."),
  url: Yup.string().when("hasSubMenus", {
    is: false,
    then: Yup.string()
      .trim()
      .required("URL is required when has-submenus is false."),
    otherwise: Yup.string().default(null).nullable(true),
  }),
  appAccessGroupIds: Yup.array()
    .of(Yup.string())
    .min(1, "Atleast one access group Id must be selected for this menu.")
    .required("Access group Id is required"),
});

const updateMenuSchema = Yup.object().shape({
  name: Yup.string().trim(),
  description: Yup.string().trim(),
  hasSubMenus: Yup.string()
    .trim()
    .oneOf(["true", "false"])
    .required("Sub Menus is required"),
  url: Yup.string().when("hasSubMenus", {
    is: false,
    then: Yup.string()
      .trim()
      .required("URL is required when has-submenus is false."),
    otherwise: Yup.string().default(null).nullable(true),
  }),
  appAccessGroupIds: Yup.array()
    .of(Yup.string())
    .min(1, "Atleast one access group Id must be selected for this menu."),
});

let initialValues: AppMenuModel = {
  appAccessGroupIds: [],
  description: "",
  hasSubMenus: false,
  name: "",
  url: null,
};

type Props = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appMenu?: AppMenuModel | {};
  closeModal: () => void;
};

type MenuOperationState = {
  editMode: boolean;
  showModal: boolean;
  readOnlyMode: boolean;
  appMenu?: AppMenuModel | {};
};

export const AppMenuModal: FC<Props> = ({
  editMode,
  showModal,
  readOnlyMode,
  appMenu,
  closeModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<MenuOperationState>({
    editMode: false,
    showModal: false,
    readOnlyMode: false,
    appMenu: undefined,
  });
  const [selectState, setSelectState] = useState<{
    hasSubMenus: Option;
    appAccessGroupIds: Option[];
    name: Option;
  }>({
    hasSubMenus: { label: "", value: false },
    appAccessGroupIds: [],
    name: { label: "", value: null },
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
    validationSchema: state.editMode ? updateMenuSchema : createMenuSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const appMenuDetails: any = {
        appAccessGroupIds: values.appAccessGroupIds,
        description: values.description,
        hasSubMenus: values.hasSubMenus,
        name: values.name,
        url: values.url,
      };
      if (!editMode && !readOnlyMode) {
        const request = await AppMenuService.createAppMenu(appMenuDetails);
        if ("data" in request) {
          showToast(request.data.message, "success");
          closeModal();
        }
      } else {
        if (state.appMenu && "appMenuId" in state.appMenu) {
          appMenuDetails.appMenuId = state.appMenu.appMenuId;
          const request = await AppMenuService.updateAppMenu(appMenuDetails);
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
    if ((editMode || readOnlyMode) && appMenu) {
      if ("appMenuId" in appMenu) {
        setState((prevState) => {
          return { ...prevState, appMenu: appMenu };
        });
        initialValues = {
          appAccessGroupIds: appMenu.appAccessGroupIds,
          description: appMenu.description,
          hasSubMenus: appMenu.hasSubMenus.toString(),
          name: appMenu.name,
          url: appMenu.url,
        };
        const accessGroupValues: any[] = [];
        accessGroupOptions.forEach((option) => {
          if (appMenu?.appAccessGroupIds?.includes(option.value)) {
            accessGroupValues.push({
              label: option.label,
              value: option.value,
            });
          }
        });
        setSelectState((prevState) => {
          return {
            ...prevState,
            appAccessGroupIds: accessGroupValues,
            name: {
              label: appMenu?.name,
              value: appMenu?.name,
            },
            hasSubMenu: {
              label: appMenu?.hasSubMenus ? "Yes" : "No",
              value: appMenu?.hasSubMenus,
            },
          };
        });
      }
    } else {
      initialValues = {
        appAccessGroupIds: [],
        name: "",
        description: "",
        hasSubMenus: false,
        url: null,
      };
      setSelectState({
        appAccessGroupIds: [],
        name: { label: "", value: null },
        hasSubMenus: { label: "", value: null },
      });
    }
  }, [showModal, editMode, readOnlyMode, appMenu]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Menus
            {showModal
              ? ` | ${
                  state.readOnlyMode && appMenu
                    ? initialValues.name
                    : state.editMode
                    ? `Update Menu`
                    : `Create Menu`
                }`
              : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={
          state.readOnlyMode && appMenu
            ? initialValues.name
            : state.editMode
            ? "Update Menu"
            : "Create Menu"
        }
        id="addMenu"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_menu_form"
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
              placeholder="Enter a menu name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.name}</span>
              </div>
            )}
          </div>
          <div className="fv-row row mb-5">
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span
                  className={clsx({
                    required: formik.values.hasSubMenus,
                  })}
                >
                  Access Groups
                </span>
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
                    return option?.value;
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
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                Sub Menus
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
                            {...formik.getFieldProps("hasSubMenus")}
                            value={"true"}
                            checked={formik.values.hasSubMenus === "true"}
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
                            {...formik.getFieldProps("hasSubMenus")}
                            value={"false"}
                            checked={formik.values.hasSubMenus === "false"}
                          />
                        </div>
                        <div className="fw-bold">No</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {formik.touched.hasSubMenus && formik.errors.hasSubMenus && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.hasSubMenus}</span>
                </div>
              )}
            </div>
          </div>
          {(formik.values.hasSubMenus === "false" ||
            formik.values.hasSubMenus === false) && (
            <div className="fv-row mb-5">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>URL</span>
              </label>
              <input
                disabled={state.readOnlyMode}
                type="text"
                {...formik.getFieldProps("url")}
                className={clsx(
                  "form-control bg-transparent py-2",
                  { "is-invalid": formik.touched.url && formik.errors.url },
                  {
                    "is-valid": formik.touched.url && !formik.errors.url,
                  }
                )}
                placeholder="Menu URL"
                value={formik.values.url || ""}
              />
              {formik.touched.hasSubMenus && formik.errors.hasSubMenus && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.hasSubMenus}</span>
                </div>
              )}
            </div>
          )}
          <div className="fv-row">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={clsx({ required: !state.editMode })}>
                Description
              </span>
            </label>
            <textarea
              disabled={state.readOnlyMode}
              rows={5}
              className="form-control bg-transparent"
              {...formik.getFieldProps("description")}
              placeholder="Description for this menu"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.description}</span>
              </div>
            )}
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
