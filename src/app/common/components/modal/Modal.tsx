import { FC } from "react";
import { WithChildren } from "../../../../_metronic/helpers";
import { Modal } from "react-bootstrap";
import { createPortal } from "react-dom";
import { KTSVG } from "../../../../_metronic/helpers";

type Props = {
  show: boolean;
  handleClose: () => void;
  modalTitle: string;
  id: string;
  modalSize?: "default" | "modal-sm" | "modal-lg" | "modal-xl";
};

const modalsRoot = document.getElementById("root-modals") || document.body;

const ModalComponent: FC<Props & WithChildren> = ({
  show,
  handleClose,
  children,
  modalTitle,
  id,
  modalSize,
}) => {
  return createPortal(
    <Modal
      id={id}
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${
        modalSize ? modalSize : ""
      }`}
      show={show}
      onHide={handleClose}
      centered
      backdrop={"static"}
    >
      <div className="modal-header">
        <h2 className="mb-0 fs-3">{modalTitle}</h2>
        {/* begin::Close */}
        <div
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={handleClose}
        >
          <KTSVG
            className="svg-icon-1"
            path="/media/icons/duotune/arrows/arr061.svg"
          />
        </div>
        {/* end::Close */}
      </div>

      <div className="modal-body py-lg-10 px-lg-10">{children}</div>
    </Modal>,
    modalsRoot
  );
};

export { ModalComponent };
