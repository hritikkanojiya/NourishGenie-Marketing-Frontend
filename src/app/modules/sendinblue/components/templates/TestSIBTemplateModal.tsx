/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { showToast } from "../../../../common/toastify/toastify.config";
import { ModalComponent } from "../../../../common/components/modal/Modal";
import { LoadingButton } from "../../../../common/components/loadingButton/LoadingButton";
import { TestTemplatePayload } from "../../models/sendinblue_template.model";
import { SendInBlueTemplateService } from "../../services/sendinblue_templates.service";
import Select from "react-select";
import { Option } from "../../../../common/globals/common.model";
import { AppListService } from "../../../lists/services/app_list.service";
import { APP_NAME } from "../../../../common/globals/common.constants";

const testTemplateSchema = Yup.object().shape({
  appListId: Yup.string().trim().required("List Id is required"),
  appSendInBlueTemplateId: Yup.string()
    .trim()
    .required("Template Id is required"),
});

let initialValues: TestTemplatePayload = {
  appListId: "",
  appSendInBlueTemplateId: "",
};

type Props = {
  closeModal: () => void;
  showModal: boolean;
  templateId: string;
};

type RouteOperationState = {
  showModal: boolean;
};

export const TestSIBTemplate: FC<Props> = ({
  closeModal,
  showModal,
  templateId,
}) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<RouteOperationState>({
    showModal: false,
  });
  const [templateIdOptions, setTemplateIdOptions] = useState<Option[]>([]);
  const [selectTemplateId, setSelectTemplateId] = useState<Option>({
    label: "Choose One",
    value: null,
  });

  const [listIdOptions, setListIdOptions] = useState<Option[]>([]);
  const [selectListId, setSelectListId] = useState<Option>({
    label: "Choose One",
    value: null,
  });

  const getTemplateIds = async () => {
    const request = await SendInBlueTemplateService.getTemplates({
      metaData: { fields: ["name", "appSendInBlueTemplateId"] },
    });
    if ("data" in request) {
      const options = request.data.sendInBlueTemplates?.map((template) => {
        return {
          label: template.name,
          value: template.appSendInBlueTemplateId,
        };
      });
      setTemplateIdOptions(options);
    }
  };

  const getListIds = async () => {
    const request = await AppListService.getAppLists({
      metaData: { fields: ["name", "appListId"] },
    });
    if ("data" in request) {
      const options = request.data.appLists?.map((list) => {
        return { label: list.name, value: list.appListId };
      });
      setListIdOptions(options);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: testTemplateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const request = await SendInBlueTemplateService.testTemplates(values);
      if ("data" in request) {
        showToast(request.data.message, "success");
        closeModal();
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    const templateOption = templateIdOptions?.find(
      (option) => option.value === templateId
    );
    if (templateOption) {
      initialValues.appSendInBlueTemplateId = templateId;
      setSelectTemplateId(templateOption);
    }
  }, [templateId]);

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        showModal: showModal,
      };
    });
    formik.resetForm();
    if (showModal) {
      getTemplateIds();
      getListIds();
    }
  }, [showModal]);
  return (
    <>
      {showModal && (
        <Helmet>
          <title>{APP_NAME} | SendInBlue Templates | Test Template</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={state.showModal}
        modalTitle={"Test template"}
        id="addRoute"
        modalSize="modal-lg"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>App SIB Template Id</span>
              </label>
              <Select
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appSendInBlueTemplateId &&
                      formik.errors.appSendInBlueTemplateId,
                  },
                  {
                    "is-valid":
                      formik.touched.appSendInBlueTemplateId &&
                      !formik.errors.appSendInBlueTemplateId,
                  }
                )}
                options={templateIdOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "appSendInBlueTemplateId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectTemplateId({ label, value });
                }}
                value={selectTemplateId}
              />
              {formik.touched.appSendInBlueTemplateId &&
                formik.errors.appSendInBlueTemplateId && (
                  <div className="fv-plugins-message-container text-danger">
                    <span role="alert">
                      {formik.errors.appSendInBlueTemplateId}
                    </span>
                  </div>
                )}
            </div>
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>App List Id</span>
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
                options={listIdOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "appListId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectListId({ label, value });
                }}
                value={selectListId}
              />
              {formik.touched.appListId && formik.errors.appListId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.appListId}</span>
                </div>
              )}
            </div>
          </div>
          <>
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
          </>
        </form>
      </ModalComponent>
    </>
  );
};
