// hooks/useRegister.js

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerUser } from "../api/authApi";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Registration successful"
      );
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    },
  });
};