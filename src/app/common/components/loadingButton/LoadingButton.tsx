import { FC } from "react";

type Props = {
  disableBtn?: boolean;
  loading: boolean;
  btnText: string;
  loadingText?: string;
  btnClass?: string;
  clickHandler?: () => any;
};

export const LoadingButton: FC<Props> = ({
  disableBtn,
  loading,
  btnText,
  loadingText,
  btnClass,
  clickHandler,
}) => {
  return (
    <>
      <div className="text-center">
        <button
          onClick={clickHandler}
          type="submit"
          id="kt_sign_in_submit"
          className={btnClass ? btnClass : "btn btn-primary w-50"}
          disabled={disableBtn}
        >
          {!loading && <span className="indicator-label">{btnText}</span>}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              {loadingText || "Please wait..."}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </>
  );
};
