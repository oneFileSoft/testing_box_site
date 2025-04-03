import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export const showToastSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { background: "#0f766e", color: "white" }, // Custom teal background
  });
};

export const showToastError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { background: "#b91c1c", color: "white" }, // Custom red background
  });
};
