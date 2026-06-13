
// components/auth/Login.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginSchema";
import { toast } from "react-toastify";

export default function Login({
  onSwitch,
  onClose,
}) {
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues:{
      "identifier": "abc@abc.com",
      "password": "abcdefg"
    }
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);

      // API Call Here
      // await sendLoginOtp(data);

      setOtpSent(true);

      toast.success("OTP Sent Successfully");
    } catch {
      toast.error("Login Failed");
    }
  };

  const verifyOtp = () => {
    toast.success("OTP Verified");
  };

  return (
    <>
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <h2 className="mb-6 text-center text-2xl font-bold">
        Login
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <input
            {...register("identifier")}
            placeholder="Email or Mobile"
            className="w-full rounded-lg border p-3"
          />
          <p className="text-sm text-red-500">
            {errors.identifier?.message}
          </p>
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-lg border p-3"
          />
          <p className="text-sm text-red-500">
            {errors.password?.message}
          </p>
        </div>

        {!otpSent ? (
          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-black p-3 text-white"
          >
            Login
          </button>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full rounded-lg border p-3"
            />

            <button
              type="button"
              onClick={verifyOtp}
              className="w-full rounded-lg bg-green-600 p-3 text-white"
            >
              Verify OTP
            </button>
          </>
        )}
      </form>

      <p className="mt-6 text-center">
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-semibold text-blue-600"
        >
          Register
        </button>
      </p>
    </>
  );
}