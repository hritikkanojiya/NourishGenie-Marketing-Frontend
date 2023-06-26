/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from "react";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { Option } from "../../../../common/globals/common.model";
import { AppSubMenuService } from "../../services/app_sub_menu.service";
import Select from "react-select";
import { AppMenuService } from "../../services/app_menu.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const createSubMenuSchema = Yup.object().shape({
  appMenuId: Yup.string().trim().required(),
  appSubMenus: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().trim().required("Name is required"),
      description: Yup.string().trim().required("Description is required"),
      url: Yup.string().trim().required("URL is required"),
    })
  ),
});

let initialValues = {
  appMenuId: "",
  appSubMenus: [{ name: "", description: "", url: "" }],
};

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

export const AddSubMenuModal: FC<Props> = ({ showModal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ showModal: false });
  const [menuId, setMenuId] = useState<Option>({
    label: "Choose One",
    value: null,
  });
  const [menuOptions, setMenuOptions] = useState<Option[]>([]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: createSubMenuSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setSubmitting(true);
      const request = await AppSubMenuService.createSubMenu(values);
      if ("data" in request) {
        showToast(request.data.message, "success");
        setLoading(false);
        setSubmitting(false);
        closeModal();
      } else {
        setStatus("An error occurred while submitting the form");
      }
    },
  });

  const getMenuIds = async () => {
    const request = await AppMenuService.getAppMenus({
      metaData: { fields: ["name", "appMenuId"] },
    });
    if ("data" in request) {
      const menus = request.data.appMenus;
      setMenuOptions(
        menus?.map((menu) => {
          return { label: menu.name, value: menu.appMenuId };
        })
      );
    }
  };

  const handleDeleteSubMenu = (index: number) => {
    if (!(formik.values.appSubMenus.length > 1)) {
      showToast("Cannot delete first Sub Menu", "error");
    } else {
      formik.values.appSubMenus.splice(index, 1);
      formik.setValues({
        ...formik.values,
        appSubMenus: [...formik.values.appSubMenus],
      });
      showToast("Sub Menu deleted", "warning");
    }
  };

  const handleAddSubMenu = () => {
    formik.setValues({
      ...formik.values,
      appSubMenus: [
        ...formik.values.appSubMenus,
        { name: "", description: "", url: "" },
      ],
    });
    showToast("Sub Menu added", "success");
  };

  useEffect(() => {
    if (showModal) {
      getMenuIds();
      formik.resetForm();
    }
    setLoading(false);
    setState((prevState) => {
      return { ...prevState, showModal: showModal };
    });
  }, [showModal]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>
            {APP_NAME} | Sub Menus{showModal ? ` | Create Sub Menu` : ""}
          </title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={"Create Sub Menu"}
        id="addSubMenu"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_sub_menu_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-9">
              <label className="form-label fs-6 fw-bolder text-dark">
                Menu
              </label>
              <Select
                menuPosition="fixed"
                isClearable={true}
                isMulti={false}
                backspaceRemovesValue={true}
                onChange={(option) => {
                  formik.setFieldValue(
                    "appMenuId",
                    option?.value ? option?.value : null
                  );
                  setMenuId({
                    label: option?.label || "",
                    value: option?.value,
                  });
                }}
                value={menuId}
                options={menuOptions}
              />
            </div>
            <div className="col-3 mt-auto">
              <label className="form-label fs-6 fw-bolder text-dark">
                Sub Menu
              </label>
              <button
                type="button"
                onClick={handleAddSubMenu}
                className="btn btn-outline btn-outline-success py-2"
                disabled={loading}
              >
                Create
              </button>
            </div>
          </div>
          {formik.values.appSubMenus?.map((appSubMenu, index: number) => (
            <React.Fragment key={index}>
              <div
                className={clsx("card shadow-xs", {
                  "mb-5": formik.values.appSubMenus.length > 1,
                })}
              >
                <div
                  className="card-header collapsible cursor-pointer min-h-50px"
                  data-bs-toggle="collapse"
                  data-bs-target={`#kt_docs_card_collapsible_${index}`}
                >
                  <h5 className="card-title fs-5 fw-bold m-0">
                    Sub Menu #{index + 1}
                  </h5>
                  <div className="card-toolbar">
                    <button
                      type="button"
                      className="btn btn-sm btn-icon btn-outline border-dashed btn-outline-danger"
                      onClick={() => {
                        handleDeleteSubMenu(index);
                      }}
                    >
                      <i className="fa fa-trash fs-3 text-danger"></i>
                    </button>
                  </div>
                </div>
                <div
                  id={`kt_docs_card_collapsible_${index}`}
                  className="collapse show"
                >
                  <div className="card-body">
                    <div className="fv-row mb-5">
                      <label className="form-label fs-6 fw-bolder text-dark">
                        <span className={"required"}>Name</span>
                      </label>
                      <input
                        type="text"
                        {...formik.getFieldProps(`appSubMenus.${index}.name`)}
                        className={clsx(
                          "form-control bg-transparent py-2",
                          {
                            "is-invalid":
                              formik.touched.appSubMenus?.[index]?.name &&
                              formik.errors.appSubMenus,
                          },
                          {
                            "is-valid":
                              formik.touched.appSubMenus?.[index]?.name &&
                              !formik.errors.appSubMenus,
                          }
                        )}
                        placeholder="Enter a sub-menu name"
                      />
                      {formik.touched.appSubMenus?.[index]?.name &&
                        formik.errors.appSubMenus && (
                          <div className="fv-plugins-message-container text-danger">
                            <span role="alert"></span>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-5">
                      <label className="form-label fs-6 fw-bolder text-dark">
                        <span className={"required"}>URL</span>
                      </label>
                      <input
                        type="text"
                        {...formik.getFieldProps(`appSubMenus.${index}.url`)}
                        className={clsx(
                          "form-control bg-transparent py-2",
                          {
                            "is-invalid":
                              formik.touched.appSubMenus?.[index]?.url &&
                              formik.errors.appSubMenus?.[index],
                          },
                          {
                            "is-valid":
                              formik.touched.appSubMenus?.[index]?.url &&
                              !formik.errors.appSubMenus?.[index],
                          }
                        )}
                        placeholder="Enter a sub-menu URL"
                      />
                      {formik.touched.appSubMenus?.[index]?.url &&
                        formik.errors.appSubMenus && (
                          <div className="fv-plugins-message-container text-danger">
                            <span role="alert"></span>
                          </div>
                        )}
                    </div>
                    <div className="fv-row mb-5">
                      <label className="form-label fs-6 fw-bolder text-dark">
                        <span className={"required"}>Description</span>
                      </label>
                      <textarea
                        className={clsx(
                          "form-control bg-transparent py-2",
                          {
                            "is-invalid":
                              formik.touched.appSubMenus?.[index]
                                ?.description &&
                              formik.errors.appSubMenus?.[index],
                          },
                          {
                            "is-valid":
                              formik.touched.appSubMenus?.[index]
                                ?.description &&
                              !formik.errors.appSubMenus?.[index],
                          }
                        )}
                        {...formik.getFieldProps(
                          `appSubMenus.${index}.description`
                        )}
                        rows={5}
                        placeholder="Description for sub-menu"
                      ></textarea>
                      {formik.touched.appSubMenus?.[index]?.description &&
                        formik.errors.appSubMenus && (
                          <div className="fv-plugins-message-container text-danger">
                            <span role="alert"></span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
          <div className="d-flex flex-wrap justify-content-evenly pb-lg-0 pt-lg-10 pt-5">
            <LoadingButton
              clickHandler={formik.handleSubmit}
              btnText="Submit"
              loading={loading}
              disableBtn={loading}
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
