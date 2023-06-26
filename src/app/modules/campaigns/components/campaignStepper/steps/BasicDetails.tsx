import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { Option } from "../../../../../common/globals/common.model";
import { AppListService } from "../../../../lists/services/app_list.service";
import clsx from "clsx";
import { StepProps } from "../../../models/campaign.model";
import TagsInput from "react-tagsinput";

const BasicDetailsStep: FC<StepProps> = ({ formik }) => {
  const [appListIdOptions, setAppListIdOptions] = useState<Option[]>([]);

  const getAppListIds = async () => {
    const request = await AppListService.getAppLists({
      metaData: { fields: ["name", "appListId"], limit: -1 },
    });
    if ("data" in request) {
      const listIds = request.data.appLists?.map((list) => {
        return { label: list.name, value: list.appListId };
      });
      setAppListIdOptions(listIds);
    }
  };

  useEffect(() => {
    getAppListIds();
  }, []);

  return (
    <div className="current" data-kt-stepper-element="content">
      <div className="w-100">
        {/*begin::Form Group */}
        <div className="fv-row mb-10">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">Name</span>
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Specify your unique app name"
            ></i>
          </label>
          <input
            {...formik.getFieldProps("name")}
            type="text"
            className={clsx(
              "form-control bg-transparent py-2",
              { "is-invalid": formik.touched.name && formik.errors.name },
              {
                "is-valid": formik.touched.name && !formik.errors.name,
              }
            )}
            placeholder="Enter name"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="fv-plugins-message-container text-danger">
              <span role="alert">{formik.errors.name}</span>
            </div>
          )}
        </div>
        {/*end::Form Group */}
        <div className="fv-row mb-10">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">Description</span>
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Specify your unique app name"
            ></i>
          </label>
          <textarea
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

        <div className="fv-row mb-10">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">List Ids</span>
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Specify your unique app name"
            ></i>
          </label>
          <Select
            options={appListIdOptions}
            menuPosition="fixed"
            isMulti={true}
            onChange={(options) => {
              const selectedValues: any = options?.map((option) => {
                return option?.value;
              });
              formik.setFieldValue("appListIds", selectedValues || []);
            }}
          />
          {formik.touched.appListIds && formik.errors.appListIds && (
            <div className="fv-plugins-message-container text-danger">
              <span role="alert">{formik.errors.appListIds}</span>
            </div>
          )}
        </div>

        <div className="fv-row mb-10">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">Tag</span>
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Specify your unique app name"
            ></i>
          </label>
          <TagsInput
            value={formik.values.tag}
            onChange={(tags: any[]) => {
              formik.setFieldValue("tag", tags);
            }}
          />
          {formik.touched.tag && formik.errors.tag && (
            <div className="fv-plugins-message-container text-danger">
              <span role="alert">{formik.errors.tag}</span>
            </div>
          )}
        </div>

        <div className="fv-row mb-10">
          <label className="form-label fs-6 fw-bolder text-dark">
            <span className="required">UTM Campaign</span>
            <i
              className="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Specify your unique app name"
            ></i>
          </label>
          <input
            {...formik.getFieldProps("utmCampaign")}
            type="text"
            className={clsx(
              "form-control bg-transparent py-2",
              {
                "is-invalid":
                  formik.touched.utmCampaign && formik.errors.utmCampaign,
              },
              {
                "is-valid":
                  formik.touched.utmCampaign && !formik.errors.utmCampaign,
              }
            )}
            placeholder="Enter name"
          />
          {formik.touched.utmCampaign && formik.errors.utmCampaign && (
            <div className="fv-plugins-message-container text-danger">
              <span role="alert">{formik.errors.utmCampaign}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { BasicDetailsStep };
