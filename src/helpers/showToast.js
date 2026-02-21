import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showToast(type, message) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    close: true,
    style: {
      background:
        type === "success"
          ? "#16a34a"
          : type === "error"
          ? "#dc2626"
          : "#2563eb",
    },
  }).showToast();
}
