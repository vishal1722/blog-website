import toast from "react-hot-toast";

export const showLoading = (message = "Please wait...") => {
  return toast.loading(message);
};

export const showSuccess = (message, id) => {
  toast.success(message || "Success", { id });
};

export const showError = (message, id) => {
  toast.error(message || "Something went wrong", { id });
};
