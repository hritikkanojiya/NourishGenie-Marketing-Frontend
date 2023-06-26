import { toast } from "react-toastify";

type TypeOptions = "info" | "success" | "warning" | "error" | "default";

const showToast = (message: string, type: TypeOptions) => {

  toast(message, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    type: type,
    toastId: message,
  });
};

export { showToast };
