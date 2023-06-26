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
import { ToggleListPayload } from "../models/app_contacts.model";
import { AppListService } from "../../lists/services/app_list.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const toggleListSchema = Yup.object().shape({
  appContactIds: Yup.array()
    .of(Yup.string().trim())
    .min(1)
    .required("App contact Id is required"),
  appListIds: Yup.array()
    .of(Yup.string().trim())
    .min(1)
    .required("App list Id is required"),
  toggleAction: Yup.string()
    .trim()
    .required("Toggle Action is required")
    .required("Toggle action is required"),
});

let initialValues: ToggleListPayload = {
  appContactIds: [],
  appListIds: [],
  toggleAction: "",
};

type Props = {
  showModal: boolean;
  closeModal: () => void;
  contactId: string;
};

export const ToggleListModal: FC<Props> = ({
  showModal,
  closeModal,
  contactId,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectState, setSelectState] = useState<{
    toggle: Option;
    contactId: Option[];
    listId: Option[];
  }>({ toggle: { label: "", value: null }, contactId: [], listId: [] });
  const [optionState, setOptionState] = useState<{
    contactOptions: Option[];
    listOptions: Option[];
  }>({ contactOptions: [], listOptions: [] });
  const toggleOption = [
    {
      value: "ADD",
      label: "ADD",
    },
    {
      value: "REMOVE",
      label: "REMOVE",
    },
  ];

  const getContactIds = async () => {
    const request = await AppContactService.getAppContacts({
      metaData: { fields: ["email", "appContactId"] },
    });
    if ("data" in request) {
      const options = request.data.appContacts?.map((contact) => {
        return { label: contact.email, value: contact.appContactId };
      });
      setOptionState((prevState) => {
        return { ...prevState, contactOptions: options };
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
    validationSchema: toggleListSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const request = await AppContactService.toggleList({
        appContactIds: values.appContactIds,
        appListIds: values.appListIds,
        toggleAction: values.toggleAction,
      });
      if ("data" in request) {
        showToast(request.data.message, "success");
        closeModal();
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    const contactOption = optionState.contactOptions?.find(
      (option) => option.value === contactId
    );
    if (contactOption) {
      setSelectState((prevState) => {
        return {
          ...prevState,
          contactId: [
            { label: contactOption.label, value: contactOption.value },
          ],
        };
      });
    }
  }, [contactId]);

  useEffect(() => {
    if (!showModal) {
      formik.resetForm();
      setSelectState({
        contactId: [],
        listId: [],
        toggle: { label: "Choose One", value: null },
      });
    } else {
      getContactIds();
      getListIds();
    }
  }, [showModal]);

  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | Contacts | Toggle Lists</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Toggle List"}
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <label className="form-label fs-6 fw-bolder text-dark">
              <span className={"required"}>Contact ID</span>
            </label>
            <Select
              className={clsx(
                "is-invalid",
                {
                  "is-invalid":
                    formik.touched.appContactIds && formik.errors.appContactIds,
                },
                {
                  "is-valid":
                    formik.touched.appContactIds &&
                    !formik.errors.appContactIds,
                }
              )}
              options={optionState.contactOptions}
              isMulti={true}
              onChange={(options) => {
                let selectedValues: any = options?.map((option) => {
                  return option?.value;
                });
                formik.setFieldValue("appContactIds", selectedValues || []);
                selectedValues = options?.map((option) => {
                  return { label: option.label, value: option.value };
                });
                setSelectState((prevState) => {
                  return { ...prevState, contactId: selectedValues || [] };
                });
              }}
              value={selectState.contactId}
            />
            {formik.touched.appContactIds && formik.errors.appContactIds && (
              <div className="fv-plugins-message-container text-danger">
                <span role="alert">{formik.errors.appContactIds}</span>
              </div>
            )}
          </div>
          <div className="fv-row row mb-5">
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>List Id</span>
              </label>
              <Select
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appListIds && formik.errors.appListIds,
                  },
                  {
                    "is-valid":
                      formik.touched.appListIds && !formik.errors.appListIds,
                  }
                )}
                options={optionState.listOptions}
                isMulti={true}
                onChange={(options) => {
                  let selectedValues: any = options?.map((option) => {
                    return option?.value;
                  });
                  formik.setFieldValue("appListIds", selectedValues || []);
                  selectedValues = options?.map((option) => {
                    return { label: option.label, value: option.value };
                  });
                  setSelectState((prevState) => {
                    return { ...prevState, listId: selectedValues || [] };
                  });
                }}
                value={selectState.listId}
              />
              {formik.touched.appListIds && formik.errors.appListIds && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.appListIds}</span>
                </div>
              )}
            </div>
            <div className="col-4">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>Toggle</span>
              </label>
              <Select
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.toggleAction && formik.errors.toggleAction,
                  },
                  {
                    "is-valid":
                      formik.touched.toggleAction &&
                      !formik.errors.toggleAction,
                  }
                )}
                options={toggleOption}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "toggleAction",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, toggle: { label, value } };
                  });
                }}
                value={selectState.toggle}
              />
              {formik.touched.toggleAction && formik.errors.toggleAction && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.toggleAction}</span>
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
