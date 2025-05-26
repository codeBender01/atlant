"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../app/toast.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      toastClassName="custom-toast"
    />
  );
}
