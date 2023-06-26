import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type Icon = "success" | "error" | "info" | "question" | "warning";

export const handleAlert = (
  title: string,
  html: string,
  icon: Icon,
  confirmBtnText: string = "Yes",
  onConfirm: () => any
) => {
  const sweetAlert = withReactContent(Swal);
  sweetAlert
    .fire({
      title: title,
      html: html,
      icon: icon,
      confirmButtonText: confirmBtnText,
      showCancelButton: true,
      cancelButtonText: "Cancel",
    })
    .then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
};
