// hooks/useLogin.js

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { loginUser } from "../api/authApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      toast.success(
        data.message || "Login successful"
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    },
  });
};