// utils/auth.ts
import { useRouter } from "next/navigation";

export const clearAuthData = () => {
  localStorage.removeItem("atoken");
  // Dispatch custom event to notify other components
  window.dispatchEvent(new Event("tokenUpdated"));
};

export const handleAuthError = (router: any) => {
  clearAuthData();
  router.push("/auth/login");
};

// Axios interceptor for handling 401 globally
import axios from "axios";

export const setupAxiosInterceptors = (router: any) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 ||
        error.response?.data?.shouldLogout
      ) {
        handleAuthError(router);
      }
      return Promise.reject(error);
    }
  );
};
