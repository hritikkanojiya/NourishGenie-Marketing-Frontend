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
import { AppListService } from "../../lists/services/app_list.service";
import { TestCampaignPayload } from "../models/campaign.model";
import { AppCampaignService } from "../services/campaign.service";
import { APP_NAME } from "../../../common/globals/common.constants";

const TestCampaignSchema = Yup.object().shape({
  appCampaignId: Yup.string().trim().required("App Campaign ID is required."),
  appListId: Yup.string().trim().required("App List ID is required"),
});

let initialValues: TestCampaignPayload = {
  appCampaignId: "",
  appListId: "",
};

type Props = {
  showModal: boolean;
  closeModal: () => void;
  campaignId: string;
};

export const TestCampaignModal: FC<Props> = ({
  showModal,
  closeModal,
  campaignId,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectState, setSelectState] = useState<{
    listId: Option;
    appCampaignId: Option;
  }>({
    listId: { label: "", value: null },
    appCampaignId: { label: "", value: null },
  });
  const [optionState, setOptionState] = useState<{
    campaignIdOptions: Option[];
    listOptions: Option[];
  }>({ campaignIdOptions: [], listOptions: [] });

  const getCampaignIds = async () => {
    const request = await AppCampaignService.getAppCampaigns({
      metaData: { fields: ["name", "appCampaignId"] },
    });
    if ("data" in request) {
      const options = request.data.appCampaignDetails?.map((campaign) => {
        return { label: campaign.name, value: campaign.appCampaignId };
      });
      setOptionState((prevState) => {
        return { ...prevState, campaignIdOptions: options };
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
    validationSchema: TestCampaignSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      const request = await AppCampaignService.testAppCampaign({
        appCampaignId: values.appCampaignId,
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
    formik.setFieldValue("appCampaignId", campaignId);
    const campaignOption = optionState.campaignIdOptions?.find(
      (campaign) => campaign.value === campaignId
    );
    if (campaignOption) {
      setSelectState((prevState) => {
        return {
          ...prevState,
          appCampaignId: {
            label: campaignOption.label,
            value: campaignOption.value,
          },
        };
      });
    }
  }, [campaignId]);

  useEffect(() => {
    if (!showModal) {
      formik.resetForm();
      setSelectState({
        appCampaignId: { label: "", value: null },
        listId: { label: "", value: null },
      });
    } else {
      getCampaignIds();
      getListIds();
    }
  }, [showModal]);

  return (
    <>
      {campaignId && (
        <Helmet>
          <title>{APP_NAME} | Campaigns | Test Campaign</title>
        </Helmet>
      )}
      <ModalComponent
        handleClose={closeModal}
        show={showModal}
        modalTitle={"Test Campaign"}
        id="addRoute"
      >
        <form
          onSubmit={formik.handleSubmit}
          id="add_service_route_modal_form"
          className="form"
        >
          <div className="fv-row row mb-5">
            <div className="col-8">
              <label className="form-label fs-6 fw-bolder text-dark">
                <span className={"required"}>App Campaign ID</span>
              </label>
              <Select
                className={clsx(
                  "is-invalid",
                  {
                    "is-invalid":
                      formik.touched.appCampaignId &&
                      formik.errors.appCampaignId,
                  },
                  {
                    "is-valid":
                      formik.touched.appCampaignId &&
                      !formik.errors.appCampaignId,
                  }
                )}
                options={optionState.campaignIdOptions}
                isMulti={false}
                onChange={(option) => {
                  formik.setFieldValue(
                    "appCampaignId",
                    option ? option.value : null
                  );
                  const label = option?.label || "";
                  const value = option?.value;
                  setSelectState((prevState) => {
                    return { ...prevState, appCampaignId: { label, value } };
                  });
                }}
                value={selectState.appCampaignId}
              />
              {formik.touched.appCampaignId && formik.errors.appCampaignId && (
                <div className="fv-plugins-message-container text-danger">
                  <span role="alert">{formik.errors.appCampaignId}</span>
                </div>
              )}
            </div>
            <div className="fv-row ">
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
